import { createCanvas, CanvasRenderingContext2D, Canvas } from "canvas";
import type { Token } from "prismjs";
import { ImageSizes, LineOptions, Options } from "../types/common";
import { evaluateHeight, getCharHeight } from "./sizes";
import { ThemeBuilder } from "../managers/ThemeBuilder";
import { backgroundPadding, BackgroundProperties, ThemeDataColor, ThemeDataProperties } from "../types/themes";
import { getFont } from "./common";

function drawText(
    ctx: CanvasRenderingContext2D, charHeight: number,
    text: string,
    lastX: number, lastY: number,
    width: number, backgroundPadding: backgroundPadding,
    options: LineOptions, fgColor: string, textLength?: number): [number, number] {
    textLength ||= text.length;

    let lastIndexSpace = 0;
    for (let i = 0; i < textLength; i++) {
        const charWidth = ctx.measureText(text[i] as string).width;
        const isBreakLine = text[i] === "\n";

        if (text[i] === " " || isBreakLine)
			lastIndexSpace = i + 1;

        if ((lastX + charWidth + ImageSizes.marginRight > width - options.lineNumberWidth) || isBreakLine) {
            const sentenceWidth = ctx.measureText(
                text.slice(0, lastIndexSpace)
            ).width;

			const printedText = text.slice(0, lastIndexSpace)?.replace(/\n/g, "");
            ctx.fillText(
                printedText,
                lastX - ctx.measureText(printedText).width,
                lastY
            );

            text = text.slice(lastIndexSpace);
            textLength -= lastIndexSpace;
            i -= lastIndexSpace;

            lastY += ImageSizes.textLineHeight + charHeight;
            lastX = backgroundPadding.left + charWidth;

            if (options.lineNumbers && isBreakLine) {
                const previousFillStyle = ctx.fillStyle;
                const lineNumber = String(options.firstLineNumber++);

                ctx.fillStyle = fgColor;
                ctx.fillText(lineNumber, lastX + ImageSizes.lineNumberMarginLeft, lastY);

                ctx.fillStyle = previousFillStyle;
            }

            lastX += options.lineNumberWidth + ImageSizes.marginLeft;
        }

        lastX += charWidth;
    }

    if (text && text !== "\n") {
        const textSize = ctx.measureText(text).width;

        if (lastX - textSize < 0)
            lastX = backgroundPadding.left + options.lineNumberWidth + ImageSizes.marginLeft + textSize;

        ctx.fillText(text, lastX - textSize, lastY);
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
    options: LineOptions,
    customThemeProperties: Readonly<ThemeDataProperties>,
    generalType?: string): [number, number] {

    for (const part of data) {
        const isString = typeof part === "string";

        if (isString && !generalType) {
            ctx.fillStyle = customThemeColors.window.defaultForegroundColor;
            [lastX, lastY] = drawText(ctx, charHeight, part, lastX, lastY, width, backgroundPadding, options, customThemeColors.window.defaultForegroundColor);
        } else {
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
                    options,
                    customThemeProperties,
                    part.type
                );
                continue;
            }

            const partType = typeof part !== "string" ? part.type : generalType;
            const isSpecialStyle = partType === "italic" || partType === "bold" || partType === "title";
            const isItalic = isSpecialStyle ? partType === "italic" : isSpecialStyle;

            if (isSpecialStyle) {
                ctx.font = (isItalic ? 'italic ' : 'bold ') + customThemeProperties.fontSize + "px " + getFont(isItalic, customThemeProperties);
            }

            ctx.fillStyle = customThemeColors.text[(((part as Token).type) || generalType) as keyof typeof customThemeColors.text] || customThemeColors.window.defaultForegroundColor;

            [lastX, lastY] = drawText(
                ctx,
                charHeight,
                isString ? part : part.content.toString(),
                lastX,
                lastY,
                width,
                backgroundPadding,
                options,
                customThemeColors.window.defaultForegroundColor,
                part.length
            );

            if (isSpecialStyle) ctx.font = customThemeProperties.fontSize + "px " + customThemeProperties.fonts.default;
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

    const {
        height,
        lineNumberWidth
    } = evaluateHeight(data, width, customThemeProperties, backgroundPadding, {
        lineNumbers: options?.lineNumbers || false,
        firstLineNumber: options?.firstLineNumber ?? 1,
        lineNumberWidth: 0
    });
    const lineOptions: LineOptions = {
        lineNumbers: options?.lineNumbers || false,
        firstLineNumber: options?.firstLineNumber ?? 1,
        lineNumberWidth
    };

    const canvas = createCanvas(
        width,
        height
    );
    const ctx = canvas.getContext("2d");

    // Draw the background
    ctx.fillStyle = backgroundProperties.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = customThemeProperties.fontSize + "px " + customThemeProperties.fonts.default;
    ctx.fillStyle = customThemeColors.window.defaultForegroundColor;

    drawTheWindow(canvas, ctx, customThemeColors, backgroundProperties, options?.title);

    let lastX = ImageSizes.marginLeft + backgroundPadding.left;
    let lastY =
        ImageSizes.marginTop * 2 +
        ImageSizes.headerHeight +
        ImageSizes.headerBottomMargin +
        backgroundPadding.top;

    const charHeight = getCharHeight(ctx.measureText("]"));

    if (options?.lineNumbers) {
        ctx.fillStyle = customThemeColors.window.defaultForegroundColor;

        const lineNumber = String(lineOptions.firstLineNumber++);
        ctx.fillText(lineNumber, lastX + ImageSizes.lineNumberMarginLeft - ImageSizes.marginLeft, lastY);

        lastX += lineNumberWidth;
    }

    iterateThroughParts(ctx, data, customThemeColors, lastX, lastY, charHeight, canvas.width - backgroundPadding.right, backgroundPadding, lineOptions, customThemeProperties);

    return canvas;
}
