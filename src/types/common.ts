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
    lineNumberMargin = 20,
    totalLineNumberMargin = 2*lineNumberMargin
}

export interface Options extends Partial<LineOptions>{
    theme?: ThemeBuilder;
    width?: number;
    title?: string;
}

export interface LineOptions {
    lineNumbers: boolean;
    firstLineNumber: number;
    lineNumberWidth: number;
}