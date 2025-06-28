(entry
  key: (key_brace) @start
  "}" @end
  (#set! role function)
)

(entry
  key: (key_paren) @start
  ")" @end
  (#set! role function)
)

(string
  (identifier) @start
  "}" @end
  (#set! role function)
)

(preamble
  "{" @start
  "}" @end
  (#set! role function)
)

(token) @subtree
