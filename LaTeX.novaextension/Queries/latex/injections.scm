; Adapted from
; https://github.com/nvim-treesitter/nvim-treesitter/tree/master/queries/latex

(minted_environment
  (begin
    language: (curly_group_text
      (text) @injection.language))
  (source_code) @injection.content)

(sagesilent_environment
  code: (source_code) @injection.content
  (#set! injection.language "python"))

(sageblock_environment
  code: (source_code) @injection.content
  (#set! injection.language "python"))

(pycode_environment
  code: (source_code) @injection.content
  (#set! injection.language "python"))

(luacode_environment
  code: (source_code) @injection.content
  (#set! injection.language "lua"))
