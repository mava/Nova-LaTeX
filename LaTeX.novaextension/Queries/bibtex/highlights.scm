; Adapted from
; https://github.com/latex-lsp/tree-sitter-bibtex/tree/master/queries

(entry_type) @keyword.construct

(string_type) @keyword.modifier

(preamble_type) @processing

[
  (junk)
  (comment)
] @comment

(command) @identifier.function

(number) @value.number

(field
  name: (identifier) @tag.attribute.name)

(token
  (identifier) @identifier.global)

[
  (brace_word)
  (quote_word)
] @value

[
  (key_brace)
  (key_paren)
] @identifier.key

(string
  name: (identifier) @identifier.global)

[
  "{"
  "}"
  "("
  ")"
] @bracket

[
  "="
  "#"
  ","
] @operator
