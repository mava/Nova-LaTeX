This extension provides basic syntax highlighting and symbolication for **LaTeX**.
Additionally, it uses the [TexLab Language Server](https://texlab.netlify.app) to enable smart code completion, contextual hover information, building PDF files, and previewing them in [Skim](https://skim-app.sourceforge.io), with LaTeX source → PDF file synchronization.

> N.B. This extension and its developer are not affiliated with TexLab.

![](https://github.com/mava/nova-latex/raw/main/test.png)

## Warning!

Unfortunately, a [known bug](https://github.com/latex-lsp/texlab/issues/310) in the current version of TexLab (2.2.1) makes the extension and Nova crash occasionally.
The bug will hopefully be fixed in the [next TexLab release](https://github.com/latex-lsp/texlab/issues/310#issuecomment-706659752).

## Requirements

Syntax highlighting and symbolication work out of the box.

The other features require the [TexLab Language Server](https://texlab.netlify.app) to be installed on your Mac.
The easiest way to install TexLab is to first install [Homebrew](https://brew.sh) and then run `brew install texlab`.

For TexLab to work correctly, as you probably guessed, you need a TeX distribution, e.g., [MacTeX](http://www.tug.org/mactex/).
And for the LaTeX source → PDF file synchronization ([SyncTeX](https://github.com/jlaurens/synctex) forward search) you need the PDF reader [Skim](https://skim-app.sourceforge.io).
In Skim’s Preferences, make sure to enable “Check for file changes” in the Sync tab.

> PDF file → LaTeX source synchronization (backward search) cannot be supported with Nova’s current command line tool. 

Finally, due to a limitation of the Nova Extensions API, you need to manually add the following lines to your `~/Library/Application\ Support/Nova/UserConfiguration.json` file:

    "latex.build" : {
      "forwardSearchAfter" : true
    },
    "latex.forwardSearch" : {
      "args" : [
        "-revert",
        "-background",
        "%l",
        "%p",
        "%f"
      ],
      "executable" : "\/Applications\/Skim.app\/Contents\/SharedSupport\/displayline"
    }

If your `UserConfiguration.json` file does not already exist, you can download [this file](https://github.com/mava/nova-latex/raw/main/UserConfiguration.json) and move it into your `~/Library/Application\ Support/Nova/` folder.
