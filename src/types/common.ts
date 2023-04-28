import { ThemeBuilder } from "../managers/ThemeBuilder";

export enum ImageSizes {
    marginLeft = 20,
    marginRight = 30,
    marginBottom = 20,
    marginTop = 20,
    MarginBetweenStatusButtons = 8,
    headerHeight = 12.5,
    headerBottomMargin = 20,
    textLineHeight = 19.2,
}

export interface Options extends Partial<LineOptions>{
    theme?: ThemeBuilder;
    width?: number;
    title?: string;
}

export interface LineOptions {
    lineNumbers: boolean;
    firstLineNumber: number;
}