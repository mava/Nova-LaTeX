var langserver = null;

exports.activate = function() {
    // Do work when the extension is activated
    langserver = new LatexLanguageServer();
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
                path || "texlab",
                "-v"
            ]
        };
        var clientOptions = {
            // The set of document syntaxes for which the server is valid
            syntaxes: ["latex"]
        };
        var client = new LanguageClient("novalatex-server", "LaTeX Language Server", serverOptions, clientOptions);
        
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
    }
    
    provideTasks() {
        let task = new Task("LaTeX → PDF");
        
        task.setAction(Task.Build, new TaskProcessAction("/usr/bin/env", {
            args: [
                "${Config:novalatex.path-latexmk}",
                "${Config:novalatex.option-latexmk}",
                "-interaction=nonstopmode",
                "-synctex=1",
                "-cd",
                "$File"
            ],
        }));
        task.setAction(Task.Clean, new TaskProcessAction("/usr/bin/env", {
            args: [
                "${Config:novalatex.path-latexmk}",
                "-c",
                "-cd",
                "$File"
            ],
        }));
        task.setAction(Task.Run, new TaskProcessAction("/usr/bin/command", {
            args: [
                "${Config:novalatex.path-skim}/Contents/SharedSupport/displayline",
                "${Config:novalatex.option-skim}",
                "$LineNumber",
                "$FileDirname/${Command:novalatex.getFilenameWithoutExt}.pdf",
                "$File"
            ],
        }));
        
        return [task];
    }
}

nova.assistants.registerTaskAssistant(new LatexTaskProvider(), {
    identifier: "novalatex-tasks"
});

nova.commands.register("novalatex.getFilenameWithoutExt", (workspace) => nova.path.splitext(workspace.activeTextEditor.document.path)[0]);

nova.commands.register("novalatex.help", () => nova.extension.openReadme());
