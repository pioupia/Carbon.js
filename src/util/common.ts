import { createCanvas, loadImage, CanvasRenderingContext2D } from 'canvas';
import Prism, { Grammar } from 'prismjs';
import { ImageSizes } from '../types/common';

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
        if(text[i] === ' ') lastIndexSpace = i;

        if ((lastX + charWidth + ImageSizes.marginRight) > width) {
            const sentenceWidth = ctx.measureText(text.slice(0, lastIndexSpace)).width;
            let cuttingIndex = i - 1;
            if (sentenceWidth + lastY + ImageSizes.marginRight <= width) {
                cuttingIndex = lastIndexSpace + 1;
            }

            text = text.slice(cuttingIndex);
            textLength = textLength - cuttingIndex;

            lastY += ImageSizes.textLineHeight + charHeight;
            lastX = ImageSizes.marginLeft;
        }

        lastX += charWidth;
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
function draw() {

}

export function parse(code: string, language: Grammar) {
    return Prism.tokenize(code, language);
    /*[
        Token {
        type: 'keyword',
        content: 'const',
        alias: undefined,
        length: 5
    },
        ' test ',
        Token { type: 'operator', content: '=', alias: undefined, length: 1 },
        ' ',
        Token {
        type: 'boolean',
        content: 'true',
        alias: undefined,
        length: 4
    },
        Token {
        type: 'punctuation',
        content: ';',
        alias: undefined,
        length: 1
    }
    ]*/
}