import { createCanvas, loadImage, CanvasRenderingContext2D } from 'canvas';
import Prism, { Grammar } from 'prismjs';
import { ImageSizes } from '../types/common';
import fs from "node:fs";

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
    let lastY = ImageSizes.marginTop * 2 + ImageSizes.headerHeight;
    const ctx = createCanvas(200, 200).getContext('2d');
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

            const printedText = text.slice(0, cuttingIndex).replace(/\n/g, '');
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

export function draw(data: (string | Prism.Token)[], width: number) {
    const canvas = createCanvas(width, evaluateHeight(data, width));
    const ctx = canvas.getContext("2d");
    const charHeight = getCharHeight(ctx.measureText(']'));

    ctx.fillStyle = "#ffffff";

    let lastX = ImageSizes.marginLeft;
    let lastY = ImageSizes.marginTop * 2 + ImageSizes.headerHeight;

    for (const part of data) {
        if (typeof part === "string") {
            [lastX, lastY] = drawText(ctx, charHeight, part, lastX, lastY, width);
        } else {
            [lastX, lastY] = drawText(ctx, charHeight, part.content as string, lastX, lastY, width, part.length);
        }
    }

    const out = fs.createWriteStream(process.cwd() + '/out/out.jpeg');
    const stream = canvas.createJPEGStream();
    stream.pipe(out);
    out.on('finish', () => console.log('The JPEG file was created.'));
}

export function parse(code: string, language: Grammar) {
    return Prism.tokenize(code, language);
}