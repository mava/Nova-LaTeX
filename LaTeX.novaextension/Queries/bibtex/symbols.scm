((entry
  ty: (entry_type) @name
  key: [
    (key_brace)
    (key_paren)
  ] @displayname
  ) @subtree
  (#strip! @name "\\@")
  (#prefix! @displayname @name " — ")
  (#set! role bookmark)
)

((string
  (string_type) @name
  (identifier) @displayname
  ) @subtree
  (#strip! @name "\\@")
  (#prefix! @displayname @name " — ")
  (#set! role constant)
)

((preamble
  (preamble_type) @name
  ) @subtree
  (#strip! @name "\\@")
  (#set! role function)
)

((field
  (identifier) @name) @subtree
  (#set! role property)
)
