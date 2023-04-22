import type { Canvas } from "canvas";
import type { Grammar } from "prismjs";
import { loadLanguage, parse } from "./util/common";
import { draw } from "./util/generateImage";
import CarbonjsError from "./errors/CarbonjsErrors";
import Languages, { LanguageObject } from "./types/Languages";
import { ThemeData } from "./types/themes";
import { defaultTheme } from "./themes/default";
import { ThemeBuilder } from "./managers/ThemeBuilder";
import {Options} from "./types/common";

/**
 * Allows you to generate an Image from code.
 * @param {string} code The code you want to render.
 * @param {Grammar} language The programming language used.
 * @param {object=} options The options for the image.
 * @param {ThemeBuilder=} options.theme The custom theme you want to apply to this image.
 * @param {number=} options.width The custom with of the image (default: 750px).
 * @param {string=} options.title The title of the window.
 * @return {Canvas} The canvas image
 */
export function render(code: string, language: LanguageObject, options?: Options): Canvas {
    if (typeof options?.width === "number" && options.width <= 100)
        throw new CarbonjsError("The 'width' can't be less than 100.");

    loadLanguage(language);

    return draw(parse(code, language.lang), options?.theme || defaultTheme, options?.width || 750, options?.title);
}

export { Languages, ThemeBuilder };
export type { ThemeData };