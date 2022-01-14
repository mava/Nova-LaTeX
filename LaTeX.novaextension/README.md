This extension provides basic support for [**LaTeX**](https://en.wikipedia.org/wiki/LaTeX):

- Syntax highlighting, document outlining, and code folding.
- Building and previewing PDF files, with LaTeX ⇌ PDF synchronization.
- Smart code completion, contextual hover information, and issue reports.

![](https://github.com/mava/nova-latex/raw/main/test@2x.gif)


## Requirements

- Syntax highlighting, document outlining, and code folding work out of the box.

- To build PDF files from LaTeX sources, [**MacTeX**](https://www.tug.org/mactex/) (or any other TeX distribution with `latexmk`) is required.

- To preview PDF files with LaTeX ⇌ PDF synchronization, the PDF reader [**Skim**](https://skim-app.sourceforge.io) is required.
To enable jumping back to the LaTeX source line in Nova corresponding to a point in a PDF in Skim, first install Nova’s **Command Line Tool**; see Nova’s **Preferences → Tools**.
Then, in Skim’s **Preferences → Sync**, under **PDF–TeX Sync support**, enter the following:

		   Preset: Custom
		  Command: nova
		Arguments: open "%file" -l %line

- Smart code completion, contextual hover information, and issue reports require the [**TexLab Language Server**](https://github.com/latex-lsp/texlab). The easiest way to install TexLab is to first install [Homebrew](https://brew.sh) and then run `brew install texlab` in a terminal.
If no language server is installed or the path provided in this extension’s **Preferences** tab is incorrect, then smart code completion, contextual hover information, and issue reports are just not available, but everything else works.
Other LaTeX language servers may also be used.
Make sure that the **Language Server** features are enabled in Nova’s **Preferences → Editor → Extensions** (they are enabled by default).

	> N.B. This extension and its developer are not affiliated with TexLab.


## Usage

To build and preview PDF files, this extension provides **Build** (⌘B) and **Run** (⌘R) tasks, available in the project toolbar, under the Project menu item, and in the command palette (⇧⌘P).
There is a also a **Clean** (⇧⌘K) task to remove TeX auxiliary files.

These tasks become automatically available in any project containing `.tex` files.
The default engine used to build PDF files (pdfLaTeX or XeLaTex or LuaLaTeX) can be chosen in this extension’s **Preferences** tab, and it can also be configured on a per-project basis in **Project → Project Settings…**

The **Run** (⌘R) task opens in Skim the PDF corresponding to the LaTeX source in Nova’s active editor, and highlights the line under the cursor’s position in Nova.
By default, Skim is kept in the background, but this can be changed in this extension’s **Preferences** tab.

To jump back to the LaTeX source line corresponding to a point in a PDF file, just ⇧⌘-*click* on a point in the PDF in Skim.
Make sure that Skim’s **PDF–TeX Sync** preferences are set up correctly, as explained above in the third bullet point under Requirements.

The log files produced during the **Build** (⌘B) task are available in Nova’s **Reports Sidebar**.
Compilation errors and warnings are displayed in the **Issues Sidebar** and in the editor gutter (this requires the TexLab Language Server).
Finally, the **Symbols Sidebar** shows an outline of the LaTeX document structure.

* * *

## Technical Implementation Details

This extension is very elementary.
As the name suggests, it only supports LaTeX (no ConTeXt, no plain TeX, …).
It uses [`latexmk`](https://www.personal.psu.edu/~jcc8/software/latexmk/) for its **Build** and **Clean** tasks:

- **Build** calls `latexmk 🔨 -interaction=nonstopmode -synctex=1 -cd` on the active file, where `🔨` is either `-pdflatex` or `-xelatex` or `-lualatex` or empty, according to the choice in **Preferences**.
- **Clean** simply calls `latexmk -c -cd` on the active file.

This should cover most use cases.
Instead of providing an interface to some of `latexmk`’s many, many configuration options in the extension Preferences, I recommend using `latexmkrc` files.
These can be tracked in revision control systems, shared with collaborators, and used in other apps and operating systems.

The Build, Run, and Clean tasks are automatically available.
Technically, they are implemented as [Task Assistants, not Task Templates](https://docs.nova.app/extensions/run-configurations/), because for most use cases “requiring a user to add an instance of a task via a Task Template may be too much overhead[.”](https://docs.nova.app/extensions/run-configurations/#defining-a-task-assistant)

The cool stuff (smart code completion, contextual hover information, issue reports) is provided by the [TexLab Language Server](https://github.com/latex-lsp/texlab).
Nova’s implementation of the [Language Server Protocol (LSP)](https://microsoft.github.io/language-server-protocol/) is great, and TexLab’s implementation of the LSP for LaTeX is great — why reinvent the wheel?
In fact, this extension uses nothing more than Nova’s Language Server Extension template (and so it can be run with other language servers; for example, [Digestif](https://github.com/astoff/digestif)).

Syntax highlighting and symbolication are also rudimentary, but seem to get the job done fast.
LaTeX ⇌ PDF synchronization just works thanks to [Skim](https://skim-app.sourceforge.io)’s implementation of the magic of [SyncTeX](https://github.com/jlaurens/synctex).

I cobbled together this extension around my (perhaps idiosyncratic) LaTeX workflow, and I’ve been happily doing all my TeXing in Nova ever since.
Hopefully other LaTeX users may find this extension useful, too!
