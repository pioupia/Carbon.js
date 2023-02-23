import { createCanvas, loadImage, CanvasRenderingContext2D } from 'canvas';
import Prism, { Grammar } from 'prismjs';
import { ImageSizes } from '../types/common';
import fs from "node:fs";
import { colors, TypeColors } from '../themes/default';

function getCharHeight(metrics: TextMetrics) {
    return metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
}

function getHeightOfAText(ctx: CanvasRenderingContext2D, charHeight: number,
                          text: string, lastX: number, lastY: number, width: number,
                          textLength?: number): number[] {
    textLength ||= text.length;

    let lastIndexSpace = 0;
    for (let i = 0; i < textLength; i++) {
        const charWidth = ctx.measureText(text[i]).width;
        const isBreakLine = text[i] === '\n';
        if (text[i] === ' ' || isBreakLine) lastIndexSpace = i + 1;

        if ((lastX + charWidth + ImageSizes.marginRight) > width || isBreakLine) {
            const sentenceWidth = ctx.measureText(text.slice(0, lastIndexSpace)).width;
            let cuttingIndex = i;
            if ((sentenceWidth + lastY + ImageSizes.marginRight) <= width) {
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

    if (text === '\n') {
        lastY += ImageSizes.textLineHeight + charHeight;
        lastX = ImageSizes.marginLeft;
    }

    return [lastX, lastY];
}

export function evaluateHeight(data: (string | Prism.Token)[], width: number) {
    let lastX = ImageSizes.marginLeft;
    let lastY = ImageSizes.marginTop * 2 + ImageSizes.headerHeight + ImageSizes.headerBottomMargin;

    const ctx = createCanvas(200, 200).getContext('2d');
    ctx.font = '16px';

    const charHeight = getCharHeight(ctx.measureText(']'));

    for (const part of data) {
        if (typeof part === "string") {
            [lastX, lastY] = getHeightOfAText(ctx, charHeight, part, lastX, lastY, width);
        } else {
            [lastX, lastY] = getHeightOfAText(ctx, charHeight, part.content.toString(), lastX, lastY, width, part.length);
        }
    }

    return lastY + ImageSizes.marginBottom + charHeight;
}

function drawText(ctx: CanvasRenderingContext2D, charHeight: number,
                  text: string, lastX: number, lastY: number, width: number,
                  textLength?: number): number[] {
    textLength ||= text.length;

    let lastIndexSpace = 0;
    for (let i = 0; i < textLength; i++) {
        const charWidth = ctx.measureText(text[i]).width;
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

export function draw(data: (string | Prism.Token)[], width: number) {
    const canvas = createCanvas(width, evaluateHeight(data, width));
    const ctx = canvas.getContext("2d");
    const charHeight = getCharHeight(ctx.measureText(']'));

    // Draw the background
    ctx.fillStyle = colors.BackgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawTheWindow(ctx);

    ctx.font = '16px Ubuntu';
    ctx.fillStyle = colors.DefaultForgroundColor;

    let lastX = ImageSizes.marginLeft;
    let lastY = ImageSizes.marginTop * 2 + ImageSizes.headerHeight + ImageSizes.headerBottomMargin;

    for (const part of data) {
        if (typeof part === "string") {
            ctx.fillStyle = colors.DefaultForgroundColor;
            [lastX, lastY] = drawText(ctx, charHeight, part, lastX, lastY, width);
        } else {
            console.log({ type: part.type, content: part.content })
            // @ts-ignore
            ctx.fillStyle = TypeColors[part.type] || colors.DefaultForgroundColor;
            [lastX, lastY] = drawText(ctx, charHeight, part.content.toString(), lastX, lastY, width, part.length);
        }
    }

    const out = fs.createWriteStream(process.cwd() + '/out/out.jpeg');
    const stream = canvas.createJPEGStream();
    stream.pipe(out);
    out.on('finish', () => console.log('The JPEG file was created.'));
}

export function parse(code: string, language: Grammar) {
    return Prism.tokenize(code.trim(), language);
}