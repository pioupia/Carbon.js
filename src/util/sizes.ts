import {createCanvas, CanvasRenderingContext2D, TextMetrics} from "canvas";
import {ImageSizes} from "../types/common";
import {backgroundPadding, ThemeDataProperties} from "../types/themes";
import type {Token} from "prismjs";

export function getCharHeight(metrics: TextMetrics) {
    return metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
}

function getIterateThroughParts(
    ctx: CanvasRenderingContext2D,
    data: (string | Token)[],
    lastX: number,
    lastY: number,
    charHeight: number,
    width: number,
    backgroundPadding: backgroundPadding
): [number, number] {
    for (const part of data) {
        if (typeof part === "string") {
            [lastX, lastY] = getHeightOfAText(
                ctx,
                charHeight,
                part,
                lastX,
                lastY,
                width,
                backgroundPadding
            );
        } else {
            if (Array.isArray(part.content)) {
                [lastX, lastY] = getIterateThroughParts(
                    ctx,
                    part.content,
                    lastX,
                    lastY,
                    charHeight,
                    width,
                    backgroundPadding
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
                backgroundPadding,
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
    backgroundPadding: backgroundPadding,
    textLength?: number
): [number, number] {
    textLength ||= text.length;

    let lastIndexSpace = 0;
    for (let i = 0; i < textLength; i++) {
        const charWidth = ctx.measureText(text[i] as string).width;
        const isBreakLine = text[i] === "\n";
        if (text[i] === " " || isBreakLine) lastIndexSpace = i + 1;

        if ((lastX + charWidth + ImageSizes.marginRight > width) || isBreakLine) {
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
            lastX = ImageSizes.marginLeft + backgroundPadding.left + charWidth;
        }

        lastX += charWidth;
    }

    return [lastX, lastY];
}

export function evaluateHeight(data: (string | Token)[], width: number, font: ThemeDataProperties, backgroundPadding: backgroundPadding) {
    let lastX = ImageSizes.marginLeft + backgroundPadding.left;
    let lastY =
        ImageSizes.marginTop * 2 +
        ImageSizes.headerHeight +
        ImageSizes.headerBottomMargin +
        backgroundPadding.top;

    const ctx = createCanvas(200, 200).getContext("2d");
    ctx.font = font.fontSize + "px " + font.fontName;

    const charHeight = getCharHeight(ctx.measureText("]"));

    lastY = getIterateThroughParts(
        ctx,
        data,
        lastX,
        lastY,
        charHeight,
        width - backgroundPadding.right, backgroundPadding
    )[1];

    return lastY + ImageSizes.marginBottom + charHeight + backgroundPadding.bottom;
}
