package tree_sitter_lovely_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_lovely "github.com/kiahjh/tree-sitter-lovely/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_lovely.Language())
	if language == nil {
		t.Errorf("Error loading Lovely grammar")
	}
}
