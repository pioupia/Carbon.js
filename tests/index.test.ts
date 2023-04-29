import { loadLanguage, parse } from "../src/util/common";
import { evaluateHeight } from "../src/util/sizes";
import * as assert from "assert";
import { Languages, ThemeBuilder } from "../src";
import CarbonjsError from "../src/errors/CarbonjsErrors";

describe("Test parse function", () => {
    it("Simple code", () => {
        assert.deepEqual(parse(`const test = true;`, Languages.javascript.lang), [
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
        assert.deepEqual(parse("test", Languages.javascript.lang), ["test"]);
    });
});

describe("Test evaluate the height of a text", () => {
    it("First test", () => {
        expect(
            evaluateHeight(
                parse(`const test = true;`, Languages.javascript.lang),
                700,
                {
                    fontName: "Ubuntu",
                    fontSize: 16
                },
                {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                },
                {
                    lineNumbers: false,
                    firstLineNumber: 1,
                    lineNumberWidth: 0
                }
            ).height
        ).toBe(109.5);
    });

    it("Second test", () => {
        expect(
            evaluateHeight(
                parse(
                    `const test \n= true;\n\nconst truc = false;`,
                    Languages.javascript.lang
                ),
                700,
                {
                    fontSize: 16,
                    fontName: "Ubuntu"
                },
                {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                },
                {
                    lineNumbers: false,
                    firstLineNumber: 1,
                    lineNumberWidth: 0
                }
            ).height.toFixed(1)
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
                    titleColor: "rgba(207,209,208,0.85)",
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
            },
            background: {
                backgroundColor: "#ABB8C3",

                hasShadow: true,
                shadowColor: "#0000008C",
                shadowBlur: 68,
                shadowOffsetY: 12,
                shadowOffsetX: 0,

                paddingBottom: 56,
                paddingTop: 56,
                paddingLeft: 56,
                paddingRight: 56
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
                    titleColor: "rgba(207,209,208,0.85)",
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
            },
            background: {
                backgroundColor: "#ABB8C3",

                hasShadow: true,
                shadowColor: "#0000008C",
                shadowBlur: 68,
                shadowOffsetY: 12,
                shadowOffsetX: 0,

                paddingBottom: 56,
                paddingTop: 56,
                paddingLeft: 56,
                paddingRight: 56
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
                titleColor: "rgba(207,209,208,0.85)",
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
            customTheme.setFontSize(5);
        }).toThrow();

        expect(() => {
            customTheme.setFontSize(28);
        }).toThrow();
    });

    it("Colours tests", () => {
        customTheme.setColor("backgroundColor", "rgba(0, 0, 0, .5)");
        expect(customTheme.getColors().window.backgroundColor).toBe("rgba(0, 0, 0, .5)");

        customTheme.setColor("backgroundColor", "rgb(0, 0, 0)");
        expect(customTheme.getColors().window.backgroundColor).toBe("rgb(0, 0, 0)");

        customTheme.setColor("backgroundColor", "hsl(0, 0%, 0%)");
        expect(customTheme.getColors().window.backgroundColor).toBe("hsl(0, 0%, 0%)");

        customTheme.setColor("backgroundColor", "hsla(0, 0%, 0%, 0.25)");
        expect(customTheme.getColors().window.backgroundColor).toBe("hsla(0, 0%, 0%, 0.25)");
    })
});


describe("Load languages", () => {
    it("Load all languages test", () => {
        const keys = ["markup", "css", "clike", "javascript", "abap", "actionscript", "ada", "apacheconf", "apl", "applescript", "arduino", "arff", "asciidoc", "asm6502", "aspnet", "autohotkey", "autoit", "bash", "basic", "batch", "bison", "brainfuck", "bro", "c", "csharp", "cpp", "coffeescript", "clojure", "crystal", "csp", "d", "dart", "diff", "django", "docker", "eiffel", "elixir", "elm", "erb", "erlang", "fsharp", "flow", "fortran", "gedcom", "gherkin", "git", "glsl", "gml", "go", "graphql", "groovy", "haml", "handlebars", "haskell", "haxe", "http", "hpkp", "hsts", "ichigojam", "icon", "inform7", "ini", "io", "j", "java", "jolie", "json", "julia", "keyman", "kotlin", "latex", "less", "liquid", "lisp", "livescript", "lolcode", "lua", "makefile", "markdown", "markup-templating", "matlab", "mel", "mizar", "monkey", "n4js", "nasm", "nginx", "nim", "nix", "nsis", "objectivec", "ocaml", "oz", "parigp", "parser", "pascal", "perl", "php", "plsql", "powershell", "processing", "prolog", "properties", "protobuf", "pug", "puppet", "pure", "python", "q", "qore", "r", "jsx", "renpy", "reason", "rest", "rip", "roboconf", "ruby", "rust", "sas", "sass", "scss", "scala", "scheme", "smalltalk", "smarty", "sql", "soy", "stylus", "swift", "tap", "tcl", "textile", "tt2", "twig", "typescript", "vbnet", "velocity", "verilog", "vhdl", "vim", "visual-basic", "wasm", "wiki", "xeora", "xojo", "xquery", "yaml"];
        for (const key of keys) {
            const language = Languages[key as keyof typeof Languages];

            loadLanguage(language);

            parse('test = true', language.lang);
        }
    });
});