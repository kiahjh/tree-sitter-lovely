/**
 * @file A low-level language built for the Humble OS
 * @author Miciah Henderson
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: `lovely`,

  extras: ($) => [$.comment, $._whitespace],

  conflicts: ($) => [[$.use_expression]],

  rules: {
    source_file: ($) => repeat($.expression),

    // extras
    _whitespace: () => /\s+/,
    comment: () => token(seq(`--`, /.*\n/)),

    expression: ($) =>
      choice(
        $.int_literal,
        $.variable_ident,
        $.prefix_expression,
        $.infix_expression,
        $.function_expression,
        $.function_call,
        $.variable_declaration,
        $.block_expression,
        $.use_expression,
      ),

    // expressions:
    int_literal: () => /\d+/,
    variable_ident: () => /[a-zA-Z_][a-zA-Z0-9_]*/,
    prefix_expression: ($) => choice(prec(10, seq(`!`, $.expression))),
    block_expression: ($) => seq(`{`, repeat($.expression), `}`),
    infix_expression: ($) =>
      choice(
        prec.left(5, seq($.expression, `^`, $.expression)),
        prec.left(4, seq($.expression, `*`, $.expression)),
        prec.left(4, seq($.expression, `/`, $.expression)),
        prec.left(3, seq($.expression, `+`, $.expression)),
        prec.left(3, seq($.expression, `-`, $.expression)),
        prec.left(2, seq($.expression, `<`, $.expression)),
        prec.left(2, seq($.expression, `>`, $.expression)),
        prec.left(2, seq($.expression, `<=`, $.expression)),
        prec.left(2, seq($.expression, `>=`, $.expression)),
        prec.left(1, seq($.expression, `==`, $.expression)),
        prec.left(1, seq($.expression, `!=`, $.expression)),
      ),
    function_expression: ($) =>
      seq(
        `fun`,
        `(`,
        separated_list(`,`, $.function_parameter),
        `)`,
        optional(seq(`->`, $.type)),
        `:`,
        $.expression,
      ),
    function_call: ($) =>
      seq(
        $.variable_ident,
        `(`,
        separated_list(
          `,`,
          seq(optional(seq($.variable_ident, `:`)), $.expression),
        ),
        `)`,
      ),
    variable_declaration: ($) =>
      prec(
        0,
        seq(
          $.variable_ident,
          `:`,
          optional($.type),
          choice(`=`, `:`),
          $.expression,
        ),
      ),
    use_expression: ($) =>
      seq(
        `use`,
        seq(
          $.variable_ident,
          repeat(seq(field(`path_separator`, `/`), $.variable_ident)),
        ),
        optional(
          seq(
            `#`,
            choice(
              seq(`(`, separated_list(`,`, $.use_expression_tail_item), `)`),
              $.use_expression_tail_item,
            ),
          ),
        ),
      ),

    use_expression_tail_item: ($) =>
      choice($.variable_ident, seq($.variable_ident, `as`, $.variable_ident)),

    function_parameter: ($) =>
      seq(
        optional(`~`),
        $.variable_ident,
        optional($.variable_ident),
        `:`,
        $.type,
      ),

    type: ($) => prec(2, $.type_ident),
    type_ident: () => /[A-Z_][a-zA-Z0-9_]*/,
  },
});

function separated_list(separator, rule) {
  return optional(seq(rule, repeat(seq(separator, rule))));
}
