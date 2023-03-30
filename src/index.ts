import type { Canvas } from "canvas";
import type { Grammar } from "prismjs";
import { parse } from "./util/common";
import { draw } from "./util/generateImage";
import CarbonjsError from "./errors/CarbonjsErrors";
import Languages from "./types/Languages";

/**
 * Allows you to generate an Image from code
 * @param {string} code The code you want to render
 * @param {Grammar} language The programming language used
 * @param {number=} customWidth The custom with of the image (default: 750px)
 * @return {Canvas}
 */
export function render(
  code: string,
  language: Grammar,
  customWidth?: number
): Canvas {
  if (typeof customWidth === "number" && customWidth <= 100)
    throw new CarbonjsError("The 'customWidth' can't be less than 100.");
  
  return draw(parse(code, language), customWidth || 750);
}

export { Languages };