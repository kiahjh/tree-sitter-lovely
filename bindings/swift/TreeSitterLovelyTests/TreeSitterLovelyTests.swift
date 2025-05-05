import XCTest
import SwiftTreeSitter
import TreeSitterLovely

final class TreeSitterLovelyTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_lovely())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Lovely grammar")
    }
}
