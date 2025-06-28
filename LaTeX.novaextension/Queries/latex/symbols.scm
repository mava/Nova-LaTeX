; Sectioning
(_
  command: _ @name
  (#has-parent? @name "part" "chapter" "section" "subsection" "subsubsection" "paragraph" "subparagraph")
  .
  (brack_group)?
  .
  (curly_group) @displayname
  (#strip! @displayname "[{}]")
  (#prefix! @displayname "§ ")
  (#set! role heading)
) @subtree

; Environments
((_
  (begin
    name: (curly_group_text
      (text) @name))
  ) @subtree
  (#set! role tag)
  (#set! autoclose.expression "\end")
  (#set! autoclose.completion "{${name}}")
)

((displayed_equation
  "\\[" @name
  ) @subtree
  (#append! @name " • \\\]")
  (#set! role tag)
)

; Labels, items
((label_definition
  command: _ @name
  name: (curly_group_text
    (text) @displayname)
  ) @subtree
  (#strip! @name "\\\\")
  (#prefix! @displayname @name " — ")
  (#set! role bookmark)
)

((enum_item
  command: _ @name
  ) @subtree
  (#strip! @name "\\\\")
  (#set! role tag-li)
)
