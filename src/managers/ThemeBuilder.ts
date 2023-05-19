import {
    BackgroundProperties, fontFamilyStyle,
    fontFamilyWeight,
    OptionalThemeData,
    ThemeData,
    ThemeDataColor,
    ThemeDataProperties
} from "../types/themes";
import CarbonjsError from "../errors/CarbonjsErrors";
import { deepFreeze, isValidColor } from "../util/common";
import { registerFont } from "canvas";

/**
 * Create a custom theme.
 */
export class ThemeBuilder {
    data: ThemeData;

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
                    title: "#CFD2D1",
                    bold: "#CFD2D1",
                    italic: "#CFD2D1",
                    content: "#CFD2D1",
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
                fonts: new Map([
                    ['normal-normal', 'Ubuntu']
                ])
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
        if (!isValidColor(color)) throw new CarbonjsError(`The color value '${color}' is not a valid color!`);

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
     * @param fontName The name of the font
     * @param {fontFamilyWeight=} fontWeight The font weight (lighter, normal, or bold).
     * @param {fontFamilyStyle=} fontStyle The font style (italic, oblique or normal).
     * @param {string=} path The path to the font file from the project root
     * @returns {ThemeBuilder}
     */
    public setFontFamily(fontName: string, fontWeight: fontFamilyWeight = "normal", fontStyle: fontFamilyStyle = "normal", path?: string): ThemeBuilder {
        if (path) registerFont(path, { family: fontName, weight: fontWeight, style: fontStyle });

        this.data.properties.fonts.set(`${fontWeight}-${fontStyle}`, fontName);
        return this;
    }

    /**
     * Change the background image property
     * @param {keyof BackgroundProperties} key The key you want to change
     * @param {BackgroundProperties[keyof BackgroundProperties]} value The value you want to set
     * @return {ThemeBuilder}
     */
    public setBackgroundProperty<K extends keyof BackgroundProperties>(key: K, value: BackgroundProperties[K]) {
        if (String(key).endsWith('Color') && !isValidColor(typeof value === 'string' ? value : ''))
            throw new CarbonjsError(`The ${key.toString()} background color value is not a hexadecimal color!`);


        this.data.background[key] = value;
        return this;
    }

    /**
     * Get the theme background padding
     *
     * @return {backgroundPadding} The background padding
     */
    public getBackgroundPadding() {
        const res = this.getBackgroundProperties();

        return {
            top: res.paddingTop,
            bottom: res.paddingBottom,
            left: res.paddingLeft,
            right: res.paddingRight
        };
    }

    /**
     * Get the background properties
     * @return {BackgroundProperties}
     */
    public getBackgroundProperties() {
        return this.toJSON().background;
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
                    "string-property": this.data.colors.text["string-property"],
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
                    title: this.data.colors.text.title,
                    content: this.data.colors.text.content,
                    atrule: this.data.colors.text.atrule,
                    selector: this.data.colors.text.selector,
                    inserted: this.data.colors.text.inserted,
                    deleted: this.data.colors.text.deleted
                },
                window: {
                    titleColor: this.data.colors.window.titleColor,
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
                fonts: this.data.properties.fonts
            },
            background: {
                backgroundColor: this.data.background.backgroundColor,
                hasShadow: this.data.background.hasShadow,
                shadowColor: this.data.background.shadowColor,
                shadowBlur: this.data.background.shadowBlur,
                shadowOffsetY: this.data.background.shadowOffsetY,
                shadowOffsetX: this.data.background.shadowOffsetX,
                paddingBottom: this.data.background.paddingBottom,
                paddingTop: this.data.background.paddingTop,
                paddingLeft: this.data.background.paddingLeft,
                paddingRight: this.data.background.paddingRight
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

        if (!data) {
            for (const key in this.data.background) {
                if (!key.endsWith('Color')) continue;

                if (!isValidColor(this.data.background[key as keyof BackgroundProperties] as string)) {
                    throw new CarbonjsError(`The ${key} background color value is not a hexadecimal color!`);
                }
            }
        }

        data ||= this.data.colors;

        for (const key in data) {
            if (typeof data[key] === "object") {
                this.verifyDataIntegrity(data[key]);
                continue;
            }

            if (!isValidColor(data[key])) {
                throw new CarbonjsError(`The ${key} color value is not a hexadecimal color!`);
            }
        }

        return true;
    }
}