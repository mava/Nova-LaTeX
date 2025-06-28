; Adapted from
; https://github.com/nvim-treesitter/nvim-treesitter/tree/master/queries/latex

; General syntax
(command_name) @identifier.function

(caption
  command: _ @identifier.function)

; \text, \intertext, \shortintertext, ...
(text_mode
  command: _ @identifier.function)

; Variables, parameters
(placeholder) @identifier.argument

(key_value_pair
  key: (_) @identifier.argument
  value: (_))

(curly_group_spec
  (text) @identifier.argument)

(brack_group_argc) @identifier.argument

[
  (operator)
  "="
  "_"
  "^"
  (delimiter)
] @operator

(enum_item
  command: _ @markup.list.item)

(math_delimiter
  left_command: _ @bracket
  left_delimiter: _ @bracket
  right_command: _ @bracket
  right_delimiter: _ @bracket)

[
  "$"
  "["
  "]"
  "{"
  "}"
] @bracket ; "(" ")" has no syntactical meaning in LaTeX

; General environments
(begin
  command: _ @keyword.construct
  name: (curly_group_text
    (text) @identifier.type))

(end
  command: _ @keyword.construct
  name: (curly_group_text
    (text) @identifier.type))

; Definitions and references
(new_command_definition
  command: _ @declaration)

(old_command_definition
  command: _ @declaration)

(let_command_definition
  command: _ @declaration)

(environment_definition
  command: _ @declaration
  name: (curly_group_text
    (_) @identifier.type))

(theorem_definition
  command: _ @declaration
  name: (curly_group_text_list
    (_) @identifier.type))

(paired_delimiter_definition
  command: _ @declaration
  declaration: (curly_group_command_name
    (_) @identifier.function))

(label_definition
  command: _ @identifier.global
  name: (curly_group_text
    (_) @identifier.key))

(label_reference_range
  command: _ @identifier.global
  from: (curly_group_text
    (_) @identifier.key)
  to: (curly_group_text
    (_) @identifier.key))

(label_reference
  command: _ @identifier.global
  names: (curly_group_text_list
    (_) @identifier.key))

(label_number
  command: _ @identifier.global
  name: (curly_group_text
    (_) @identifier.key)
  number: (_) @identifier.key)

(citation
  command: _ @identifier.global
  keys: (curly_group_text_list) @identifier.key)

(hyperlink
  command: _ @identifier.global
  uri: (curly_group_uri
    (_) @identifier.key.url))

(glossary_entry_definition
  command: _ @identifier.global
  name: (curly_group_text
    (_) @identifier.key))

(glossary_entry_reference
  command: _ @identifier.global
  name: (curly_group_text
    (_) @identifier.key))

(acronym_definition
  command: _ @identifier.global
  name: (curly_group_text
    (_) @identifier.key))

(acronym_reference
  command: _ @identifier.global
  name: (curly_group_text
    (_) @identifier.key))

(color_definition
  command: _ @identifier.global
  name: (curly_group_text
    (_) @identifier.key))

(color_reference
  command: _ @identifier.global
  name: (curly_group_text
    (_) @identifier.key)?)

; Sectioning
(_
  command: _ @keyword.modifier
  (#has-parent? @keyword.modifier "part" "chapter" "section" "subsection" "subsubsection" "paragraph" "subparagraph")
  toc: (brack_group
    (_) @markup.heading)?
  text: (curly_group
    (_) @markup.heading))

(title_declaration
  command: _ @identifier.function
  options: (brack_group
    (_) @markup.heading)?
  text: (curly_group
    (_) @markup.heading))

(author_declaration
  command: _ @identifier.function
  authors: (curly_group_author_list
    (author)+ @markup.heading))

; Beamer frames
(generic_environment
  (begin
    name: (curly_group_text
      (text) @identifier.type)
    (#eq? @identifier.type "frame"))
  .
  (curly_group
    (_) @markup.heading))

((generic_command
  command: (command_name) @_name
  arg: (curly_group
    (_) @markup.heading))
  (#eq? @_name "\\frametitle"))

((generic_command
  command: (command_name) @_name
  arg: (curly_group
    (_) @markup.italic))
  (#eq? @_name "\\emph" "\\textit" "\\mathit"))

((generic_command
  command: (command_name) @_name
  arg: (curly_group
    (_) @markup.bold))
  (#eq? @_name "\\textbf" "\\mathbf"))

(generic_command
  (command_name) @keyword.condition
  (#match? @keyword.condition "^\\if[a-zA-Z@]+$"))

(generic_command
  (command_name) @keyword.condition
  (#eq? @keyword.condition "\\fi" "\\else"))

; File inclusion commands
(class_include
  command: _ @processing
  path: (curly_group_path) @string)

(package_include
  command: _ @processing
  paths: (curly_group_path_list) @string)

(latex_include
  command: _ @processing
  path: (curly_group_path) @string)

(verbatim_include
  command: _ @processing
  path: (curly_group_path) @string)

(import_include
  command: _ @processing
  directory: (curly_group_path) @string
  file: (curly_group_path) @string)

(bibstyle_include
  command: _ @processing
  path: (curly_group_path) @string)

(bibtex_include
  command: _ @processing
  paths: (curly_group_path_list) @string)

(biblatex_include
  "\\addbibresource" @processing
  glob: (curly_group_glob_pattern) @string)

(graphics_include
  command: _ @processing
  path: (curly_group_path) @string)

(svg_include
  command: _ @processing
  path: (curly_group_path) @string)

(inkscape_include
  command: _ @processing
  path: (curly_group_path) @string)

(tikz_library_import
  command: _ @processing
  paths: (curly_group_path_list) @string)

; Math
[
  (displayed_equation)
  (inline_formula)
] @markup.code

(math_environment
  (_) @markup.code)

; Comments
[
  (line_comment)
  (block_comment)
  (comment_environment)
] @comment

((line_comment) @markup.link
  (#match? @markup.link "^% !TeX"))
