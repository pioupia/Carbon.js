import { createCanvas, CanvasRenderingContext2D, TextMetrics } from "canvas";
import { ImageSizes, LineOptions } from "../types/common";
import { backgroundPadding, ThemeDataProperties } from "../types/themes";
import type { Token } from "prismjs";

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
    backgroundPadding: backgroundPadding,
    lineNumberWidth: number
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
                backgroundPadding,
                lineNumberWidth
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
                    backgroundPadding,
                    lineNumberWidth
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
                lineNumberWidth,
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
    lineNumberWidth: number,
    textLength?: number
): [number, number] {
    textLength ||= text.length;

    let lastIndexSpace = 0;
    for (let i = 0; i < textLength; i++) {
        const charWidth = ctx.measureText(text[i] as string).width;
        const isBreakLine = text[i] === "\n";

        if (text[i] === " " || isBreakLine)
			lastIndexSpace = i + 1;

        if ((lastX + charWidth + ImageSizes.marginRight > width - lineNumberWidth) || isBreakLine) {
            const sentenceWidth = ctx.measureText(
                text.slice(0, lastIndexSpace)
            ).width;

            text = text.slice(lastIndexSpace);
            textLength -= lastIndexSpace;
            i -= lastIndexSpace;

            lastY += ImageSizes.textLineHeight + charHeight;
            lastX = ImageSizes.marginLeft + backgroundPadding.left + charWidth + lineNumberWidth;
        }

        lastX += charWidth;
    }

    return [lastX, lastY];
}

function getLineCount(data: (string | Token)[]): number {
    return data.reduce((prev, curr) => {
        let more;

        if (typeof curr === "string") {
            more = curr.replace(/[^\n]/g, '').length;
        } else if (typeof curr.content === "string") {
            more = curr.content.replace(/[^\n]/g, '').length;
        } else {
            more = getLineCount(curr.content as Token[]);
        }

        return prev + more;
    }, 0)
}

export function evaluateHeight(data: (string | Token)[], width: number, font: ThemeDataProperties, backgroundPadding: backgroundPadding, options: LineOptions) {
    let lastX = ImageSizes.marginLeft + backgroundPadding.left;
    let lastY =
        ImageSizes.marginTop * 2 +
        ImageSizes.headerHeight +
        ImageSizes.headerBottomMargin +
        backgroundPadding.top;

    const ctx = createCanvas(200, 200).getContext("2d");
    ctx.font = font.fontSize + "px " + font.fonts.default;

    const charHeight = getCharHeight(ctx.measureText("]"));
    let lastLineNumber = 0;

    if (options.lineNumbers) {
        lastLineNumber = ImageSizes.lineNumberMarginLeft +
            ctx.measureText(
                String(options.firstLineNumber + getLineCount(data))
            ).width;
        lastX += lastLineNumber;
    }

    lastY = getIterateThroughParts(
        ctx,
        data,
        lastX,
        lastY,
        charHeight,
        width - backgroundPadding.right,
        backgroundPadding,
        lastLineNumber
    )[1];

    return {
        height: lastY + ImageSizes.marginBottom + charHeight + backgroundPadding.bottom,
        lineNumberWidth: lastLineNumber
    };
}
