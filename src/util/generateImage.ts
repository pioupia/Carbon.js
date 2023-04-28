import { createCanvas, CanvasRenderingContext2D, Canvas } from "canvas";
import type { Token } from "prismjs";
import { ImageSizes, Options } from "../types/common";
import { evaluateHeight, getCharHeight } from "./sizes";
import { ThemeBuilder } from "../managers/ThemeBuilder";
import {backgroundPadding, BackgroundProperties, ThemeDataColor} from "../types/themes";

function drawText(
    ctx: CanvasRenderingContext2D, charHeight: number,
    text: string,
    lastX: number, lastY: number,
    width: number, backgroundPadding: backgroundPadding, textLength?: number): [number, number] {
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

            const printedText = text.slice(0, cuttingIndex)?.replace(/\n/g, "");
            ctx.fillText(
                printedText,
                lastX - ctx.measureText(printedText).width,
                lastY
            );

            text = text.slice(cuttingIndex);
            textLength -= cuttingIndex;
            i -= cuttingIndex;

            lastY += ImageSizes.textLineHeight + charHeight;
            lastX = backgroundPadding.left + ImageSizes.marginLeft + charWidth;
        }

        lastX += charWidth;
    }

    if (text && text !== "\n") {
        ctx.fillText(text, lastX - ctx.measureText(text).width, lastY);
    }

    return [lastX, lastY];
}

function drawCircle(ctx: CanvasRenderingContext2D,
                    leftPosition: number, topPosition: number, radius: number) {
    ctx.beginPath();
    ctx.arc(leftPosition, topPosition, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
}

function drawTheWindow(canvas: Canvas, ctx: CanvasRenderingContext2D, theme: ThemeDataColor, backgroundProperties: BackgroundProperties, title?: string) {
    ctx.lineWidth = 0.5;

    const { paddingLeft, paddingTop, paddingRight, paddingBottom } = backgroundProperties;

    // Draw the window background shadow
    if (backgroundProperties.hasShadow) {
        ctx.shadowColor = backgroundProperties.shadowColor;
        ctx.shadowBlur = backgroundProperties.shadowBlur;
        ctx.shadowOffsetY = backgroundProperties.shadowOffsetY;
        ctx.shadowOffsetX = backgroundProperties.shadowOffsetX;
    }

    // Draw the window background
    ctx.fillStyle = theme.window.backgroundColor;
    ctx.roundRect(paddingLeft, paddingTop, canvas.width - paddingRight - paddingLeft, canvas.height - paddingBottom - paddingTop,
        5);
    ctx.fill();

    // Reset the shadow
    ctx.shadowColor = "#00000000";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Draw the buttons
    const radius = (ImageSizes.headerHeight - 0.5) / 2;
    const leftPosition = ImageSizes.marginLeft + radius + paddingLeft;
    const topPosition = ImageSizes.marginTop + radius + paddingTop;

    ctx.fillStyle = theme.window.closeWindowColor;
    ctx.strokeStyle = theme.window.closeWindowColorStroke;
    drawCircle(ctx, leftPosition, topPosition, radius);

    ctx.fillStyle = theme.window.minifyWindowColor;
    ctx.strokeStyle = theme.window.minifyWindowColorStroke;
    drawCircle(
        ctx,
        leftPosition + radius * 2 + ImageSizes.marginBetweenStatusButtons,
        topPosition,
        radius
    );

    ctx.fillStyle = theme.window.reduceWindowColor;
    ctx.strokeStyle = theme.window.reduceWindowColorStroke;
    drawCircle(
        ctx,
        leftPosition + (radius * 2 + ImageSizes.marginBetweenStatusButtons) * 2,
        topPosition,
        radius
    );

    // Draw the text in the center of the window
    if (title) {
        const textMeasure = ctx.measureText(title);

        const centerWindow = (canvas.width - paddingRight - paddingLeft) / 2;
        const centerText = centerWindow + (textMeasure.width / 2);

        ctx.fillStyle = theme.window.titleColor;
        ctx.fillText(title, centerText, topPosition + (getCharHeight(textMeasure) / 4));
    }
}

function iterateThroughParts(
    ctx: CanvasRenderingContext2D, data: (string | Token)[],
    customThemeColors: ThemeDataColor,
    lastX: number, lastY: number,
    charHeight: number, width: number,
    backgroundPadding: backgroundPadding,
    generalType?: string): [number, number] {

    for (const part of data) {
        const isString = typeof part === "string";

        if (isString && !generalType) {
            ctx.fillStyle = customThemeColors.window.defaultForegroundColor;
            [lastX, lastY] = drawText(ctx, charHeight, part, lastX, lastY, width, backgroundPadding);
        } else {
            ctx.fillStyle = customThemeColors.text[(((part as Token).type) || generalType) as keyof typeof customThemeColors.text] || customThemeColors.window.defaultForegroundColor;

            if (!isString && Array.isArray(part.content)) {
                [lastX, lastY] = iterateThroughParts(
                    ctx,
                    part.content,
                    customThemeColors,
                    lastX,
                    lastY,
                    charHeight,
                    width,
                    backgroundPadding,
                    part.type
                );
                continue;
            }

            [lastX, lastY] = drawText(
                ctx,
                charHeight,
                isString ? part : part.content.toString(),
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

export function draw(data: (string | Token)[], customTheme: ThemeBuilder, width: number, options: Options): Canvas {
    const customThemeColors = customTheme.getColors();
    const customThemeProperties = customTheme.getFont();
    const backgroundPadding = customTheme.getBackgroundPadding();
    const backgroundProperties = customTheme.getBackgroundProperties();

    width += backgroundPadding.left + backgroundPadding.right;

    const canvas = createCanvas(
        width,
        evaluateHeight(data, width, customThemeProperties, backgroundPadding, { lineNumbers: <boolean>options.lineNumbers, firstLineNumber: <number>options.firstLineNumber })
    );
    const ctx = canvas.getContext("2d");

    // Draw the background
    ctx.fillStyle = backgroundProperties.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = customThemeProperties.fontSize + "px " + customThemeProperties.fontName;
    ctx.fillStyle = customThemeColors.window.defaultForegroundColor;

    drawTheWindow(canvas, ctx, customThemeColors, backgroundProperties, options.title);

    let lastX = ImageSizes.marginLeft + backgroundPadding.left;
    let lastY =
        ImageSizes.marginTop * 2 +
        ImageSizes.headerHeight +
        ImageSizes.headerBottomMargin +
        backgroundPadding.top;

    const charHeight = getCharHeight(ctx.measureText("]"));

    iterateThroughParts(ctx, data, customThemeColors, lastX, lastY, charHeight, canvas.width - backgroundPadding.right, backgroundPadding);

    return canvas;
}
