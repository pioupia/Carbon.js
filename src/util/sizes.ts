import { createCanvas, CanvasRenderingContext2D, TextMetrics } from "canvas";
import { ImageSizes } from "../types/common";
import { ThemeDataProperties } from "../types/themes";

export function getCharHeight(metrics: TextMetrics) {
  return metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
}

function getIterateThroughParts(
  ctx: CanvasRenderingContext2D,
  data: (string | Prism.Token)[],
  lastX: number,
  lastY: number,
  charHeight: number,
  width: number
): [number, number] {
  for (const part of data) {
    if (typeof part === "string") {
      [lastX, lastY] = getHeightOfAText(
        ctx,
        charHeight,
        part,
        lastX,
        lastY,
        width
      );
    } else {
      if (Array.isArray(part.content)) {
        [lastX, lastY] = getIterateThroughParts(
          ctx,
          part.content,
          lastX,
          lastY,
          charHeight,
          width
        );
        continue;
      }

      [lastX, lastY] = getHeightOfAText(
        ctx,
        charHeight,
        part.content.toString(),
        lastX,
        lastY,
        width,
        part.length
      );
    }
  }

  return [lastX, lastY];
}

function getHeightOfAText(
  ctx: CanvasRenderingContext2D,
  charHeight: number,
  text: string,
  lastX: number,
  lastY: number,
  width: number,
  textLength?: number
): [number, number] {
  textLength ||= text.length;

  let lastIndexSpace = 0;
  for (let i = 0; i < textLength; i++) {
    const charWidth = ctx.measureText(text[i] as string).width;
    const isBreakLine = text[i] === "\n";
    if (text[i] === " " || isBreakLine) lastIndexSpace = i + 1;

    if (lastX + charWidth + ImageSizes.marginRight > width || isBreakLine) {
      const sentenceWidth = ctx.measureText(
        text.slice(0, lastIndexSpace)
      ).width;
      let cuttingIndex = i;
      if (sentenceWidth + lastY + ImageSizes.marginRight <= width) {
        cuttingIndex = lastIndexSpace;
      }

      text = text.slice(cuttingIndex);
      textLength -= cuttingIndex;
      i -= cuttingIndex;

      lastY += ImageSizes.textLineHeight + charHeight;
      lastX = ImageSizes.marginLeft;
    }

    lastX += charWidth;
  }

  if (text === "\n") {
    lastY += ImageSizes.textLineHeight + charHeight;
    lastX = ImageSizes.marginLeft;
  }

  return [lastX, lastY];
}

export function evaluateHeight(data: (string | Prism.Token)[], width: number, font: ThemeDataProperties) {
  let lastX = ImageSizes.marginLeft;
  let lastY =
    ImageSizes.marginTop * 2 +
    ImageSizes.headerHeight +
    ImageSizes.headerBottomMargin;

  const ctx = createCanvas(200, 200).getContext("2d");
  ctx.font = font.fontSize + "px " + font.fontName;

  const charHeight = getCharHeight(ctx.measureText("]"));

  [lastX, lastY] = getIterateThroughParts(
    ctx,
    data,
    lastX,
    lastY,
    charHeight,
    width
  );

  return lastY + ImageSizes.marginBottom + charHeight;
}
