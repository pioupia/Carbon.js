import { createCanvas, loadImage } from 'canvas';
import Prism, { Grammar } from 'prismjs';


/**
 * Margin:
 *  - 15px left + 30px right
 *  - 20px bottom
 *  - 20px top + layout of 50px
 * @param data
 * @param width
 */
function evaluateHeight(data: (string | Prism.Token)[], width: number) {
    let lastX = 15; // margin: 15px
    let lastY = 70; // margin: 20px + layout;

    for (const part of data) {

    }
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