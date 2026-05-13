> *Requires Nova&#8239;≥&#8239;14&#8239;—&#8239;see the extension’s help (in particular, the last bullet point under *Requirements*) for details. For older versions of Nova, please install [version&nbsp;1.1](https://github.com/mava/Nova-LaTeX/releases/tag/v1.1) from the extension’s repository.*

## Version 2.2

- ***Fixed:*** Resolved an issue with relative file paths for the main `.tex` file in **Project Settings**

## Version 2.1

- ***Improved:*** Run task now fails gracefully if there is no PDF file

## Version 2.0

- ***New:*** Nova&nbsp;14 adds built-in support for language servers, so parts of this extension became redundant and were removed

## Version 1.1

- ***Fixed:*** Resolved an (embarrassing) issue with automatic environment closing

## Version 1.0

- 🎉 Good enough for 1.0 🤞

---

## Version 0.11

- ***Improved:*** Files with extension `.ltx`, `.sty`, `.cls`, `.clo`, `.bbx`, `.cbx`, `.dbx`, or `.tikz`, or with `\documentclass` declaration near the top, are now also recognized as LaTeX
- ***Improved:*** Tweaked BibTeX syntax highlighting

## Version 0.10

- ***Improved:*** Tweaked symbols so that section names (instead of labels) appear in the [minimap](https://help.nova.app/editor/overview/#minimap)

## Version 0.9

- ***Fixed:*** New Tree-sitter syntaxes now also work with older versions of Nova

## Version 0.8

- ***New:*** Language syntaxes for both LaTeX and BibTeX have been totally rewritten using Tree-sitter, with much improved highlighting, symbolization, and folding

## Version 0.7

- ***New:*** Added an option in **Preferences** to use Skim’s reading bar to indicate position

## Version 0.6

- ***New:*** `.bib` files now also have smart code completion, contextual hover information, and issue reports (provided by the language server)

## Version 0.5

- ***New:*** Added custom task templates (which, for example, can be used in Nova 9’s new **Task Pipelines**)
- ***Improved:*** Tasks now fail gracefully if unavailable (e.g., when the active tab is a terminal and no main `.tex` file has been chosen)

## Version 0.4

- ***New:*** Added BibTeX (`.bib`) syntax highlighting, symbolization, and folding

## Version 0.3

- ***New:*** Added an option in **Project Settings** to choose a main `.tex` file
- ***Improved:*** Paths are no longer needed in the **Extension Preferences** if the executables are in `$PATH`

## Version 0.2

- ***Fixed:*** Fixed the Run task, which was broken by a bug introduced in Nova 9

## Version 0.1

- First alpha release

## Version 0.0

- Initial commit on GitHub
