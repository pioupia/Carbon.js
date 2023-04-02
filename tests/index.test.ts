import { parse } from "../src/util/common";
import { evaluateHeight } from "../src/util/sizes";
import * as assert from "assert";
import { Languages, ThemeBuilder } from "../src";
import CarbonjsError from "../src/errors/CarbonjsErrors";

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


describe("Create a custom theme", () => {
    const customTheme = new ThemeBuilder();

    it("First test", () => {
        expect(
            customTheme.toJSON()
        ).toEqual({
            colors: {
                text: {
                    keyword: "#e6cd69",
                    boolean: "#cd3f45",
                    number: "#cd3f45",
                    string: "#55b5db",
                    "function-variable": "#55b5db",
                    parameter: "#55b5db",
                    function: "#a074c4",
                    builtin: "#55b5db",
                    "class-name": "#55b5db",
                    char: "#55b5db",
                    symbol: "#55b5db",
                    regex: "#55b5db",
                    url: "#55b5db",
                    operator: "#9fca56",
                    variable: "#55b5db",
                    constant: "#55b5db",
                    property: "#a074c4",
                    "string-property": "#a074c4",
                    punctuation: "#CFD2D1",
                    important: "#e6cd69",
                    comment: "#41535b",
                    tag: "#55b5db",
                    "attr-name": "#cd3f45",
                    "attr-value": "#55b5db",
                    namespace: "#a074c4",
                    prolog: "#41535b",
                    doctype: "#41535b",
                    cdata: "#41535b",
                    entity: "#cd3f45",
                    bold: "#CFD2D1",
                    italic: "#CFD2D1",
                    atrule: "#55b5db",
                    selector: "#55b5db",
                    inserted: "#292",
                    deleted: "#d44"
                },
                window: {
                    backgroundColor: "#151718",
                    defaultForegroundColor: "#CFD2D1",
                    closeWindowColor: "#FF5F56",
                    closeWindowColorStroke: "#E0443E",
                    minifyWindowColor: "#FFBD2E",
                    minifyWindowColorStroke: "#DEA123",
                    reduceWindowColor: "#27C93F",
                    reduceWindowColorStroke: "#1AAB29",
                }
            },
            properties: {
                fontSize: 16,
                fontName: "Ubuntu"
            }
        });
    });

    it("Second test", () => {
        customTheme.setColor("string", "#fd0");

        expect(
            customTheme.toJSON()
        ).toEqual({
            colors: {
                text: {
                    keyword: "#e6cd69",
                    boolean: "#cd3f45",
                    number: "#cd3f45",
                    string: "#fd0",
                    "function-variable": "#55b5db",
                    parameter: "#55b5db",
                    function: "#a074c4",
                    builtin: "#55b5db",
                    "class-name": "#55b5db",
                    char: "#55b5db",
                    symbol: "#55b5db",
                    regex: "#55b5db",
                    url: "#55b5db",
                    operator: "#9fca56",
                    variable: "#55b5db",
                    constant: "#55b5db",
                    property: "#a074c4",
                    "string-property": "#a074c4",
                    punctuation: "#CFD2D1",
                    important: "#e6cd69",
                    comment: "#41535b",
                    tag: "#55b5db",
                    "attr-name": "#cd3f45",
                    "attr-value": "#55b5db",
                    namespace: "#a074c4",
                    prolog: "#41535b",
                    doctype: "#41535b",
                    cdata: "#41535b",
                    entity: "#cd3f45",
                    bold: "#CFD2D1",
                    italic: "#CFD2D1",
                    atrule: "#55b5db",
                    selector: "#55b5db",
                    inserted: "#292",
                    deleted: "#d44"
                },
                window: {
                    backgroundColor: "#151718",
                    defaultForegroundColor: "#CFD2D1",
                    closeWindowColor: "#FF5F56",
                    closeWindowColorStroke: "#E0443E",
                    minifyWindowColor: "#FFBD2E",
                    minifyWindowColorStroke: "#DEA123",
                    reduceWindowColor: "#27C93F",
                    reduceWindowColorStroke: "#1AAB29",
                }
            },
            properties: {
                fontSize: 16,
                fontName: "Ubuntu"
            }
        });
    });

    it("Third test", () => {
        expect(
            customTheme.getColors(),
        ).toEqual({
            text: {
                keyword: "#e6cd69",
                boolean: "#cd3f45",
                number: "#cd3f45",
                string: "#fd0",
                "function-variable": "#55b5db",
                parameter: "#55b5db",
                function: "#a074c4",
                builtin: "#55b5db",
                "class-name": "#55b5db",
                char: "#55b5db",
                symbol: "#55b5db",
                regex: "#55b5db",
                url: "#55b5db",
                operator: "#9fca56",
                variable: "#55b5db",
                constant: "#55b5db",
                property: "#a074c4",
                "string-property": "#a074c4",
                punctuation: "#CFD2D1",
                important: "#e6cd69",
                comment: "#41535b",
                tag: "#55b5db",
                "attr-name": "#cd3f45",
                "attr-value": "#55b5db",
                namespace: "#a074c4",
                prolog: "#41535b",
                doctype: "#41535b",
                cdata: "#41535b",
                entity: "#cd3f45",
                bold: "#CFD2D1",
                italic: "#CFD2D1",
                atrule: "#55b5db",
                selector: "#55b5db",
                inserted: "#292",
                deleted: "#d44"
            },
            window: {
                backgroundColor: "#151718",
                defaultForegroundColor: "#CFD2D1",
                closeWindowColor: "#FF5F56",
                closeWindowColorStroke: "#E0443E",
                minifyWindowColor: "#FFBD2E",
                minifyWindowColorStroke: "#DEA123",
                reduceWindowColor: "#27C93F",
                reduceWindowColorStroke: "#1AAB29",
            }
        });
    });

    it("Errors tests", () => {
        expect(() => {
            customTheme.setColor("backgroundColor", "test");
        }).toThrow(CarbonjsError);

        expect(() => {
            customTheme.setColor("backgroundColor", "#ff");
        }).toThrow(CarbonjsError);

        expect(() => {
            customTheme.setColor("backgroundColor", "#fffff");
        }).toThrow(CarbonjsError);

        expect(() => {
            customTheme.setColor("backgroundColor", "#ffffffff");
        }).toThrow(CarbonjsError);

        expect(() => {
            customTheme.setFontSize(5);
        }).toThrow();

        expect(() => {
            customTheme.setFontSize(28);
        }).toThrow();
    });
});