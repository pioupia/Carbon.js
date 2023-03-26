import type { Canvas } from "canvas";
import type { Grammar } from "prismjs";
import { parse } from "./util/common";
import { draw } from "./util/generateImage";
import CarbonjsError from "./errors/CarbonjsErrors";
import { languages } from "prismjs";

/**
 * Allows you to generate an Image from code
 * @param {string} code
 * @param {Grammar} language
 * @param {number=} customWidth The custom with of the image (default: 750px)
 * @return {Canvas}
 */
export default function carbon(
  code: string,
  language: Grammar,
  customWidth?: number
): Canvas {
  if (typeof customWidth === "number" && customWidth <= 100)
    throw new CarbonjsError("The 'customWidth' can't be less than 100.");

  return draw(parse(code, language), customWidth || 750);
}

export const Languages = languages;
