; Sectioning
(_
  .
  (curly_group) @start
  (#has-parent? @start "part" "chapter" "section" "subsection" "subsubsection" "paragraph" "subparagraph")
  (#set! role heading)
) @end.after

; Environments
(_
  (begin
    name: (curly_group_text) @start)
  (end) @end
  (#set! role tag)
)

(displayed_equation
  "\\[" @start
  "\\]" @end
  (#set! role tag)
)

(inline_formula
  "\\(" @start
  "\\)" @end
  (#set! role tag)
)

(inline_formula
  "\$" @start
  "\$" @end
  (#set! role tag)
)
