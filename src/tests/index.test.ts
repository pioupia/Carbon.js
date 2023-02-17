import { parse } from "src";
import * as assert from "assert";
import { FlagsDataTypes } from "src/types/common";

describe("Test parse function", () => {
    it("Simple code", () => {
        assert.deepEqual(parse(`const test = true;`),
            [
                {
                    content: "const ",
                    type: FlagsDataTypes.KEYWORDS,
                    words: ["const"]
                },
                {
                    content: "test = ",
                    type: FlagsDataTypes.NEUTRAL,
                    words: ["test", "="]
                },
                {
                    content: "true",
                    type: FlagsDataTypes.KEYWORDS,
                    words: ["true"]
                },
                {
                    content: ";",
                    type: FlagsDataTypes.NEUTRAL,
                    words: [";"]
                }
            ]
        );
    });
});