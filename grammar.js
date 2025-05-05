/**
 * @file A low-level language built for the Humble OS
 * @author Miciah Henderson
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "lovely",

  rules: {
    // TODO: add the actual grammar rules
    source_file: ($) => "hello",
  },
});
