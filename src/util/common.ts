import { createCanvas, loadImage, CanvasRenderingContext2D } from 'canvas';
import Prism, { Grammar } from 'prismjs';
import { ImageSizes } from '../types/common';
import fs from "node:fs";
import { colors, properties, TypeColors } from '../themes/default';

export function parse(code: string, language: Grammar) {
    return Prism.tokenize(code.trim(), language);
}