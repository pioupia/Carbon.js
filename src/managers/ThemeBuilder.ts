import { OptionalThemeData, ThemeData } from "../types/themes";
import CarbonjsError from "../errors/CarbonjsErrors";
import { isHexadecimalColor } from "../util/common";

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
                fontSize: 16
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
    setColor(name: (keyof typeof this.data.colors.text | keyof typeof this.data.colors.window), color: string): ThemeBuilder {
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
     * @param {number} fontSize
     * @return {ThemeBuilder}
     * @public
     */
    public setFontSize(fontSize: number): ThemeBuilder {
        if (isNaN(fontSize) || fontSize < 8 || fontSize > 64) throw new CarbonjsError("The font size property cant be less than 8, or more than 64.");

        this.data.properties.fontSize = fontSize;
        return this;
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
                this.data.properties.fontSize > 64
            )
        ) throw new CarbonjsError("The font size property cant be less than 8, or more than 64.");

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