import { parse } from "../util/common";
import { evaluateHeight } from "../util/sizes";
import * as assert from "assert";
import { Languages } from "../index";

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
        700
      )
    ).toBe(102.5);
  });

  it("Second test", () => {
    expect(
      evaluateHeight(
        parse(
          `const test \n= true;\n\nconst truc = false;`,
          Languages.javascript
        ),
        700
      ).toFixed(1)
    ).toBe("190.1");
  });
});
