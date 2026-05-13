exports.activate = function() {
    // Do work when the extension is activated
    nova.assistants.registerTaskAssistant(new LatexTaskProvider(), {
        identifier: "novalatex.tasks"
    });
    
    nova.commands.register("novalatex.help", () => nova.extension.openReadme());
 // nova.commands.register("novalatex.pref", () => nova.openConfig("info.varisco.LaTeX"));
}

exports.deactivate = function() {
    // Clean up state before the extension is deactivated
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
        let configfile = getLocalConfig("novalatex.mainfile");
        if (configfile && !nova.path.isAbsolute(configfile)) {
            configfile = nova.path.join(nova.workspace.path, configfile);
        }
        const mainfile = configfile || activefile;
        let command;
        let args;
        if (mainfile) {
            if (context.action === Task.Run) {
                const pdffile = nova.path.join(nova.path.dirname(mainfile), nova.path.splitext(mainfile)[0]) + ".pdf";
                if (nova.fs.stat(pdffile)?.isFile()) {
                    command = nova.path.join(nova.config.get("novalatex.path-skim"), "Contents/SharedSupport/displayline");
                    args = [
                        (activefile ? getLnCol(editor)[0] : 0).toString(),
                        pdffile
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
                    args = ["No PDF file " + pdffile];
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
