import { parse } from "../util/common";
import * as assert from "assert";
import Prism from "prismjs";

describe("Test parse function", () => {
    it("Simple code", () => {
        assert.deepEqual(parse(`const test = true;`, Prism.languages.javascript),
            [
                {
                    type: 'keyword',
                    content: 'const',
                    alias: undefined,
                    length: 5
                },
                ' test ',
                { type: 'operator', content: '=', alias: undefined, length: 1 },
                ' ',
                {
                    type: 'boolean',
                    content: 'true',
                    alias: undefined,
                    length: 4
                },
                {
                    type: 'punctuation',
                    content: ';',
                    alias: undefined,
                    length: 1
                }
            ]
        );
    });

    it("just sentence", () => {
        assert.deepEqual(
            parse("test", Prism.languages.javascript),
            ['test']
        );
    });
});