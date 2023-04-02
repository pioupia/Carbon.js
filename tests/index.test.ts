import { parse } from "../src/util/common";
import { evaluateHeight } from "../src/util/sizes";
import * as assert from "assert";
import { Languages } from "../src";

describe("Test parse function", () => {
  it("Simple code", () => {
    assert.deepEqual(parse(`const test = true;`, Languages.javascript), [
      {
        type: "keyword",
        content: "const",
        alias: undefined,
        length: 5,
      },
      " test ",
      { type: "operator", content: "=", alias: undefined, length: 1 },
      " ",
      {
        type: "boolean",
        content: "true",
        alias: undefined,
        length: 4,
      },
      {
        type: "punctuation",
        content: ";",
        alias: undefined,
        length: 1,
      },
    ]);
  });

  it("just sentence", () => {
    assert.deepEqual(parse("test", Languages.javascript), ["test"]);
  });
});

describe("Test evaluate the height of a text", () => {
  it("First test", () => {
    expect(
      evaluateHeight(
        parse(`const test = true;`, Languages.javascript),
        700,
          {
            fontName: "Ubuntu",
            fontSize: 16
          }
      )
    ).toBe(109.5);
  });

  it("Second test", () => {
    expect(
      evaluateHeight(
        parse(
          `const test \n= true;\n\nconst truc = false;`,
          Languages.javascript
        ),
        700,
          {
            fontSize: 16,
            fontName: "Ubuntu"
          }
      ).toFixed(1)
    ).toBe("218.1");
  });
});