import { parse, parseCode } from "../util/common";
import * as assert from "assert";
import { FlagsDataTypes } from "src/types/common";
import Prism from "prismjs";

describe("Test parse function", () => {
    it("Simple code", () => {
        assert.deepEqual(parse(`const test = true;`, ["javascript"]).parts,
            [
                {
                    children: ["const"],
                    scope: 'keyword'
                },
                " test ",
                "= ",
                {
                    children: ["true"],
                    scope: 'literal'
                },
                ";"
            ]
        );
    });

    it("just sentence", () => {
        assert.deepEqual(
            parse("test", ["javascript"]).parts,
            ['test']
        )
    });
});