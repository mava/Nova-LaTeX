var langserver = null;
const defaultPath = {
    texlab: '/usr/local/bin/texlab',
    latexmk: '/Library/TeX/texbin/latexmk'
};
const texlabErrorMessage = 'The TexLab language server is not working. Check the extension’s settings.';


function getEditor(editorOrWorkspace) {
    return TextEditor.isTextEditor(editorOrWorkspace)
        ? editorOrWorkspace
        : editorOrWorkspace.activeTextEditor;
}

function getPosition(editor) {
    // Convert start position of selected range into LSP coordinates
    const lines = editor.document
        .getTextInRange(new Range(0, editor.selectedRange.start))
        .split(editor.document.eol);
    const position = {
        line: lines.length - 1,
        character: lines.pop().length
    };
    return position;
}


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
        // Observe the configuration setting for the server's location, and restart the server on change
        nova.config.observe('novalatex.path-texlab', function(path) {
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
        
        // Use the default server path
        if (!path) {
            path = defaultPath.texlab;
        }
        
        // Create the client
        var serverOptions = {
            path: path,
            args: ['-vvvv'],
            env: {
                RUST_BACKTRACE: 'full',
            }
        };
        var clientOptions = {
            // The set of document syntaxes for which the server is valid
            syntaxes: ['latex']
        };
        var client = new LanguageClient('latex-texlab', 'TexLab Language Server', serverOptions, clientOptions);
        
        try {
            // Start the client
            client.start();
            
            // Add the client to the subscriptions to be cleaned up
            nova.subscriptions.add(client);
            this.languageClient = client;
        }
        catch (err) {
            // If the .start() method throws, it's likely because the path to the language server is invalid
            console.error(err);
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

class LatexTasksProvider {
    constructor() {}
    
    provideTasks() {
        let task = new Task('LaTeX → PDF');
        
        task.setAction(Task.Build, new TaskCommandAction('latex.build'));
        task.setAction(Task.Clean, new TaskCommandAction('latex.clean'));
        
        return [task];
    }
}


nova.assistants.registerTaskAssistant(new LatexTasksProvider(), {
    identifier: 'latex-tasks',
    name: 'LaTeX'
});


nova.commands.register('latex.forwardSearch', (editor) => {
    const uri = editor.document.uri;
    const position = getPosition(editor);
    
    console.log(`Opening PDF of ${uri} in Skim at position corresponding to: Ln ${position.line + 1}, Col ${position.character + 1}.`);
    
    if (!langserver.languageClient) {
        console.error(texlabErrorMessage);
        return;
    }
    
    langserver.languageClient.sendRequest('textDocument/forwardSearch', {
        textDocument: { uri: uri },
        position: position
    })
    .then(response => {
        // https://texlab.netlify.app/docs/reference/custom-messages#forward-search-request
        switch (response.status) {
            case 0:
                console.log('Success — The previewer process executed the command without any errors.');
                break;
            case 1:
                console.error('Error — The previewer process executed the command with errors.');
                break;
            case 2:
                console.error('Failure — The previewer process failed to start or crashed.');
                break;
            case 3:
                console.error('Unconfigured — The previewer command is not configured.');
                break;
        }
    })
    .catch(error => {
        console.error(error);
    });
});

nova.commands.register('latex.build', (editorOrWorkspace) => {
    const editor = getEditor(editorOrWorkspace);
    
    if (!editor || (editor.document.syntax !== 'latex')) {
        console.log('Nothing to build.');
        return;
    }
    
    console.log('Trying to build the active document.');
    
    return new Promise((resolve, reject) => {
        if (langserver.languageClient) {
            editor.save()
            .then(() => {
                const uri = editor.document.uri;
                
                console.log(`Building ${uri}`);
                
                return langserver.languageClient.sendRequest('textDocument/build', {
                    textDocument: { uri: uri }
                });
            })
            .then(response => {
                // https://texlab.netlify.app/docs/reference/custom-messages#build-request
                switch (response.status) {
                    case 0:
                        console.log('Success — The build process terminated without any errors.');
                        resolve('PDF built succesfully.');
                        break;
                    case 1:
                        console.error('Error — The build process terminated with errors.');
                        reject('The PDF build process failed.');
                        break;
                    case 2:
                        console.error('Failure — The build process failed to start or crashed.');
                        reject('The PDF build process failed.');
                        break;
                    case 3:
                        console.error('Canceled — The build process was canceled.');
                        reject('The PDF build process was canceled.');
                        break;
                }
            })
            .catch(error => {
                console.error(error);
                reject(error);
            });
        } else {
            console.error(texlabErrorMessage);
            reject(texlabErrorMessage);
        }
    });
});

nova.commands.register('latex.clean', (editorOrWorkspace) => {
    const editor = getEditor(editorOrWorkspace);
    
    if (!editor || editor.document.isUntitled) {
        console.log('Nothing to clean.');
        return;
    }
    
    const latexmk = nova.config.get('novalatex.path-latexmk') || defaultPath.latexmk;
    const options = {
        args: ['-c', '-cd', editor.document.path]
    };
    const process = new Process(latexmk, options);
    
    console.log(`Running ${latexmk} ${options.args.join(' ')}`);
    
    return new Promise((resolve, reject) => {
        try {
            process.start();
            resolve();
        }
        catch (error) {
            console.error(error);
            reject(error);
        }
    });
});
