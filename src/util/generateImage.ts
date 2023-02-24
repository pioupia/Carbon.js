import { createCanvas, CanvasRenderingContext2D, Canvas } from "canvas";
import { colors, properties, TypeColors } from "../themes/default";
import { ImageSizes } from "../types/common";
import { evaluateHeight, getCharHeight } from "./sizes";

function drawText(ctx: CanvasRenderingContext2D, charHeight: number,
                  text: string, lastX: number, lastY: number, width: number,
                  textLength?: number): [number, number] {
    textLength ||= text.length;

    let lastIndexSpace = 0;
    for (let i = 0; i < textLength; i++) {
        const charWidth = ctx.measureText(text[i] as string).width;
        const isBreakLine = text[i] === '\n';
        if (text[i] === ' ' || isBreakLine) lastIndexSpace = i + 1;

        if ((lastX + charWidth + ImageSizes.marginRight) > width || isBreakLine) {
            const sentenceWidth = ctx.measureText(text.slice(0, lastIndexSpace)).width;
            let cuttingIndex = i;
            if ((sentenceWidth + lastY + ImageSizes.marginRight) <= width) {
                cuttingIndex = lastIndexSpace;
            }

            const printedText = (text.slice(0, cuttingIndex))?.replace(/\n/g, '');
            ctx.fillText(printedText, lastX - ctx.measureText(printedText).width, lastY);

            text = text.slice(cuttingIndex);
            textLength -= cuttingIndex;
            i -= cuttingIndex;

            lastY += ImageSizes.textLineHeight + charHeight;
            lastX = ImageSizes.marginLeft;
        }

        lastX += charWidth;
    }

    if (text === '\n') {
        lastY += ImageSizes.textLineHeight + charHeight;
        lastX = ImageSizes.marginLeft;
    } else if (text) {
        ctx.fillText(text, lastX - ctx.measureText(text).width, lastY);
    }

    return [lastX, lastY];
}

function drawCircle(ctx: CanvasRenderingContext2D, leftPosition: number, topPosition: number, radius: number) {
    ctx.beginPath();
    ctx.arc(leftPosition, topPosition, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
}

function drawTheWindow(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = .5;
    const radius = (ImageSizes.headerHeight - .5) / 2;
    const leftPosition = ImageSizes.marginLeft + radius;
    const topPosition = ImageSizes.marginTop + radius;

    ctx.fillStyle = colors.CloseWindowColor;
    ctx.strokeStyle = colors.CloseWindowColorStroke;
    drawCircle(ctx, leftPosition, topPosition, radius);

    ctx.fillStyle = colors.MinifyWindowColor;
    ctx.strokeStyle = colors.MinifyWindowColorStroke;
    drawCircle(ctx,
        leftPosition + (radius * 2) + ImageSizes.MarginBetweenStatusButtons,
        topPosition,
        radius);

    ctx.fillStyle = colors.ReduceWindowColor;
    ctx.strokeStyle = colors.ReduceWindowColorStroke;
    drawCircle(ctx,
        leftPosition + ((radius * 2) + ImageSizes.MarginBetweenStatusButtons) * 2,
        topPosition,
        radius);
}

function interateThroughParts(ctx: CanvasRenderingContext2D, data: (string | Prism.Token)[],
                              lastX: number, lastY: number, charHeight: number, width: number,
                              generalType?: string): [number, number]  {
    for (const part of data) {
        const isString = typeof part === "string";
        if (isString && !generalType) {
            ctx.fillStyle = colors.DefaultForgroundColor;
            [lastX, lastY] = drawText(ctx, charHeight, part, lastX, lastY, width);
        } else {
            // @ts-ignore
            ctx.fillStyle = TypeColors[part.type || generalType] || colors.DefaultForgroundColor;

            if (!isString && Array.isArray(part.content)) {
                [lastX, lastY] = interateThroughParts(ctx, part.content, lastX, lastY, charHeight, width, part.type);
                continue;
            }

            [lastX, lastY] = drawText(ctx, charHeight, isString ? part : part.content.toString(), lastX, lastY, width, part.length);
        }
    }

    return [lastX, lastY];
}
export function draw(data: (string | Prism.Token)[], width: number): Canvas {
    const canvas = createCanvas(width, evaluateHeight(data, width));
    const ctx = canvas.getContext("2d");
    const charHeight = getCharHeight(ctx.measureText(']'));

    // Draw the background
    ctx.fillStyle = colors.BackgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawTheWindow(ctx);

    ctx.font = properties.FontSize + 'px Ubuntu';
    ctx.fillStyle = colors.DefaultForgroundColor;

    let lastX = ImageSizes.marginLeft;
    let lastY = ImageSizes.marginTop * 2 + ImageSizes.headerHeight + ImageSizes.headerBottomMargin;

    interateThroughParts(ctx, data, lastX, lastY, charHeight, width);

    return canvas;
}