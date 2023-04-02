import { OptionalThemeData, ThemeData, ThemeDataColor, ThemeDataProperties } from "../types/themes";
import CarbonjsError from "../errors/CarbonjsErrors";
import { deepFreeze, isHexadecimalColor } from "../util/common";
import { registerFont } from "canvas";

/**
 * Create a custom theme.
 */
export class ThemeBuilder {
    private readonly data: ThemeData;

    constructor(theme?: OptionalThemeData) {
        this.data = {
            colors: {
                text: {
                    keyword: "#e6cd69",
                    boolean: "#cd3f45",
                    number: "#cd3f45",
                    string: "#55b5db",
                    "function-variable": "#55b5db",
                    parameter: "#55b5db",
                    function: "#a074c4",
                    builtin: "#a074c4",
                    "class-name": "#e6cd69",
                    char: "#55b5db",
                    symbol: "#e69d69",
                    regex: "#e6cd69",
                    url: "#558fdb",
                    operator: "#CFD2D1",
                    variable: "#55b5db",
                    constant: "#55b5db",
                    property: "#55b5db",
                    punctuation: "#CFD2D1",
                    important: "#FF5F56",
                    comment: "#959696",
                    tag: "#55b5db",
                    "attr-name": "#55b5db",
                    "attr-value": "#cd3f45",
                    namespace: "#e6cd69",
                    prolog: "#959696",
                    doctype: "#959696",
                    cdata: "#959696",
                    entity: "#e6cd69",
                    bold: "#d7d9d8",
                    italic: "#CFD2D1",
                    atrule: "#55b5db",
                    selector: "#CFD2D1",
                    inserted: "#73c55c",
                    deleted: "#c55c68"
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
        };

        if (theme) this.mergeData(this.data, theme);
        this.verifyDataIntegrity();
    }

    /**
     * Change the color of an element.
     * @param {string} name The name of the color in the config.
     * @param {string} color Hexadecimal color.
     * @returns {ThemeBuilder}
     * @public
     */
    public setColor(name: (keyof typeof this.data.colors.text | keyof typeof this.data.colors.window), color: string): ThemeBuilder {
        const colors = this.data.colors;
        const isText = colors.text[name as keyof typeof colors.text];
        const isWindow = colors.window[name as keyof typeof colors.window];

        if (!isText && !isWindow) throw new CarbonjsError(`The ${name} color value doesn't exist!`);
        if (!isHexadecimalColor(color)) throw new CarbonjsError(`The color value '${color}' is not a valid color!`);

        if (isText) {
            colors.text[name as keyof typeof colors.text] = color;
            return this;
        }

        colors.window[name as keyof typeof colors.window] = color;
        return this;
    }

    /**
     * Set a new fontSize to the theme
     * @param {number} fontSize Number between 8 and 64 (e.g. 8 <= fontSize <= 26)
     * @return {ThemeBuilder}
     * @public
     */
    public setFontSize(fontSize: number): ThemeBuilder {
        if (isNaN(fontSize) || fontSize < 8 || fontSize > 26) throw new CarbonjsError("The font size property cant be less than 8, or more than 26.");

        this.data.properties.fontSize = fontSize;
        return this;
    }

    /**
     * Set the theme font and register it.
     * @param {string} path The path to the font file from the project root
     * @param fontName The name of the font
     * @returns {ThemeBuilder}
     */
    public setFontFamily(path: string, fontName: string): ThemeBuilder {
        registerFont(path, { family: fontName });

        this.data.properties.fontName = fontName;
        return this;
    }

    public getFont(): Readonly<ThemeDataProperties> {
        return this.toJSON().properties;
    }

    /**
     * Get the text and window colors.
     * @return {Readonly<ThemeDataColor>} Read-Ony data theme color object
     * @public
     */
    public getColors(): Readonly<ThemeDataColor> {
        return this.toJSON().colors;
    }

    /**
     * Get the JSON theme data object
     * @return {Readonly<ThemeData>} Read-Ony data object
     * @public
     */
    public toJSON(): Readonly<ThemeData> {
        return deepFreeze({
            colors: {
                text: {
                    keyword: this.data.colors.text.keyword,
                    boolean: this.data.colors.text.boolean,
                    number: this.data.colors.text.number,
                    string: this.data.colors.text.string,
                    "function-variable": this.data.colors.text["function-variable"],
                    parameter: this.data.colors.text.parameter,
                    function: this.data.colors.text.function,
                    builtin: this.data.colors.text.builtin,
                    "class-name": this.data.colors.text["class-name"],
                    char: this.data.colors.text.char,
                    symbol: this.data.colors.text.symbol,
                    regex: this.data.colors.text.regex,
                    url: this.data.colors.text.url,
                    operator: this.data.colors.text.operator,
                    variable: this.data.colors.text.variable,
                    constant: this.data.colors.text.constant,
                    property: this.data.colors.text.property,
                    punctuation: this.data.colors.text.punctuation,
                    important: this.data.colors.text.important,
                    comment: this.data.colors.text.comment,
                    tag: this.data.colors.text.tag,
                    "attr-name": this.data.colors.text["attr-name"],
                    "attr-value": this.data.colors.text["attr-value"],
                    namespace: this.data.colors.text.namespace,
                    prolog: this.data.colors.text.prolog,
                    doctype: this.data.colors.text.doctype,
                    cdata: this.data.colors.text.cdata,
                    entity: this.data.colors.text.entity,
                    bold: this.data.colors.text.bold,
                    italic: this.data.colors.text.italic,
                    atrule: this.data.colors.text.atrule,
                    selector: this.data.colors.text.selector,
                    inserted: this.data.colors.text.inserted,
                    deleted: this.data.colors.text.deleted
                },
                window: {
                    backgroundColor: this.data.colors.window.backgroundColor,
                    defaultForegroundColor: this.data.colors.window.defaultForegroundColor,
                    closeWindowColor: this.data.colors.window.closeWindowColor,
                    closeWindowColorStroke: this.data.colors.window.closeWindowColorStroke,
                    minifyWindowColor: this.data.colors.window.minifyWindowColor,
                    minifyWindowColorStroke: this.data.colors.window.minifyWindowColorStroke,
                    reduceWindowColor: this.data.colors.window.reduceWindowColor,
                    reduceWindowColorStroke: this.data.colors.window.reduceWindowColorStroke
                },
            },
            properties: {
                fontSize: this.data.properties.fontSize,
                fontName: this.data.properties.fontName
            }
        });
    }

    /**
     * Allows you to merge two different object
     * @param {*} data
     * @param {*} theme
     * @private
     */
    private mergeData(data: any, theme: any): void {
        for (const key in theme) {
            const typeOfData = typeof data[key];

            if (typeOfData !== "object" && typeof theme[key] === typeOfData) {
                data[key] = theme[key];
                continue;
            }

            if (data[key] && theme[key])
                this.mergeData((data as any)[key], theme[key]);
        }
    }

    /**
     * Allows you to verify the data object
     * @param data
     * @private
     */
    private verifyDataIntegrity(data?: any): boolean {
        if (!data &&
            (
                typeof (this.data.properties.fontSize as any) !== "number" ||
                this.data.properties.fontSize < 8 ||
                this.data.properties.fontSize > 26
            )
        ) throw new CarbonjsError("The font size property cant be less than 8, or more than 26.");

        data ||= this.data.colors;

        for (const key in data) {
            if (typeof data[key] === "object") {
                this.verifyDataIntegrity(data[key]);
                continue;
            }

            if (!isHexadecimalColor(data[key])) {
                throw new CarbonjsError(`The ${key} color value is not a hexadecimal color!`);
            }
        }

        return true;
    }
}