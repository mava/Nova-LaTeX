var langserver = null;

exports.activate = function() {
    // Do work when the extension is activated
    langserver = new LatexLanguageServer();
    
    nova.assistants.registerTaskAssistant(new LatexTaskProvider(), {
        identifier: "novalatex.tasks"
    });
    
    nova.commands.register("novalatex.help", () => nova.extension.openReadme());
 // nova.commands.register("novalatex.pref", () => nova.openConfig("info.varisco.LaTeX"));
}

exports.deactivate = function() {
    // Clean up state before the extension is deactivated
    if (langserver) {
        langserver.deactivate();
        langserver = null;
    }
}


class LatexLanguageServer {
    constructor() {
        // Observe the configuration setting for the server’s location, and restart the server on change
        nova.config.observe("novalatex.path-server", function(path) {
            this.start(path);
        }, this);
    }
    
    deactivate() {
        this.stop();
    }
    
    start(path) {
        if (this.languageClient) {
            this.languageClient.stop();
            nova.subscriptions.remove(this.languageClient);
        }
        
        // Create the client
        var serverOptions = {
            path: "/usr/bin/env",
            args: [
                path?.trim() || "texlab",
                "-v"
            ]
        };
        var clientOptions = {
            // The set of document syntaxes for which the server is valid
            syntaxes: ["latex", "bibtex"]
        };
        var client = new LanguageClient("novalatex.server", "LaTeX Language Server", serverOptions, clientOptions);
        
        try {
            // Start the client
            client.start();
            
            // Add the client to the subscriptions to be cleaned up
            nova.subscriptions.add(client);
            this.languageClient = client;
        }
        catch (err) {
            // If the .start() method throws, it’s likely because the path to the language server is invalid
            if (nova.inDevMode()) {
                console.error(err);
            }
        }
    }
    
    stop() {
        if (this.languageClient) {
            this.languageClient.stop();
            nova.subscriptions.remove(this.languageClient);
            this.languageClient = null;
        }
    }
}


class LatexTaskProvider {
    constructor() {
        switch (nova.config.get("novalatex.option-skim")) {
            case "":
                nova.config.set("novalatex.option-skim-background", false);
                // fall through
            case "-background":
                nova.config.set("novalatex.option-skim", undefined);
        }
    }
    
    provideTasks() {
        let task = new Task("LaTeX → PDF");
        task.setAction(Task.Build, new TaskResolvableAction());
        task.setAction(Task.Clean, new TaskResolvableAction());
        task.setAction(Task.Run,   new TaskResolvableAction());
        task.image = "task";
        return [task];
    }
    
    resolveTaskAction(context) {
        const getLocalConfig = (key) => (
            context.config
            ? context.config.get(key)
            : nova.workspace.config.get(key)
        );
        const editor = nova.workspace.activeTextEditor;
        const activefile = editor?.document?.path;
        const mainfile = getLocalConfig("novalatex.mainfile") || activefile;
        let command;
        let args;
        if (mainfile) {
            if (context.action === Task.Run) {
                command = nova.path.join(nova.config.get("novalatex.path-skim"), "Contents/SharedSupport/displayline");
                args = [
                    (activefile ? getLnCol(editor)[0] : 0).toString(),
                    nova.path.join(nova.path.dirname(mainfile), nova.path.splitext(mainfile)[0]) + ".pdf"
                ];
                if (activefile) {
                    args.push(activefile);
                }
                for (const option of ["-readingbar", "-background"]) {
                    if (nova.config.get("novalatex.option-skim" + option, "boolean")) {
                        args.unshift(option);
                    }
                }
            } else {
                if (context.action === Task.Build) {
                    args = [
                        getLocalConfig("novalatex.option-latexmk") ?? nova.config.get("novalatex.option-latexmk"),
                        "-interaction=nonstopmode",
                        "-synctex=1"
                    ];
                } else if (context.action === Task.Clean) {
                    args = [
                        "-c"
                    ];
                } else return;
                command = "/usr/bin/env";
                args = [
                    nova.config.get("novalatex.path-latexmk"),
                    ...args,
                    "-cd",
                    mainfile
                ];
            }
        } else {
            args = [
                "Nothing to " + (
                    context.action === Task.Build ? "build"
                  : context.action === Task.Clean ? "clean"
                  : context.action === Task.Run   ? "run"
                  : "do"
                ) + "."
            ];
        }
        return new TaskProcessAction(command || "/bin/echo", {args: args});
    }
}


function getLnCol(editor) {
    // Returns [Ln, Col] coordinates of start position of selected range in editor.
    const lines = editor
        .getTextInRange(new Range(0, editor.selectedRange.start))
        .split(editor.document.eol);
    return [
        lines.length,
        lines[lines.length - 1].length + 1
    ];
}
