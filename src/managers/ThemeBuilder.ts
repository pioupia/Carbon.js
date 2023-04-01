import { OptionalThemeData, ThemeData } from "../types/themes";
import CarbonjsError from "../errors/CarbonjsErrors";
import { isHexadecimalColor } from "../util/common";

export class ThemeBuilder {
    private data: ThemeData;

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
            },
        };

        if (theme) this.mergeData(this.data, theme);
        this.verifyDataIntegrity();
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
                throw new CarbonjsError(`The ${key} color value is not a hexadecimal color !`);
            }
        }

        return true;
    }
}