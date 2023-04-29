import { ThemeBuilder } from "../managers/ThemeBuilder";

export enum ImageSizes {
    marginLeft = 20,
    marginRight = 30,
    marginBottom = 20,
    marginTop = 20,
    marginBetweenStatusButtons = 8,
    headerHeight = 12.5,
    headerBottomMargin = 20,
    textLineHeight = 19.2,
    lineNumberMarginLeft = 20
}

export interface Options extends Partial<OpenLineOptions>{
    theme?: ThemeBuilder;
    width?: number;
    title?: string;
}

export interface OpenLineOptions {
    lineNumbers: boolean;
    firstLineNumber: number;
}

export interface LineOptions extends OpenLineOptions{
    lineNumberWidth: number;
}