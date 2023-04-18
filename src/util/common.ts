import { tokenize, Grammar, languages } from "prismjs";
import Languages, { LanguageObject } from "../types/Languages";

const loadLanguages = require("prismjs/components/index");

export function parse(code: string, language: Grammar) {
    return tokenize(code.trim(), language);
}

/**
 * Verify if a color is a valid color or not.
 * @param {string} color
 * @returns {boolean}
 */
export function isValidColor(color: string): boolean {
    return /^#(([0-9a-f]{3}){2}([0-9a-f]{2})?|([0-9a-f]{3}))$/i.test(color)
        || /^rgba\s*\((\s*\d*\.?\d*,){3}\s*(0|0?\.\d*)\)$/i.test(color)
        || /^rgb\s*\((\s*\d*\.?\d*,){2}\s?\d*\.?\d*\)$/i.test(color)
        || /^hsla\s*\(\s*\d*\.?\d*,(\s*\d*\.?\d*%,){2}\s*(0|0?\.\d*)\)$/i.test(color)
        || /^ hsl\s*\(\s*\d*\.?\d*,\s*\d*\.?\d*%,\s*\d*\.?\d*%\)$/i.test(color);
}

/**
 * Make the deep freeze of an object.
 * @param {object} object
 * @return {Readonly<object>} A totally freeze object.
 */
export function deepFreeze<T extends object>(object: T): Readonly<T> {
    const propNames = Reflect.ownKeys(object);

    for (const name of propNames) {
        const value = object[name as keyof object];

        if ((value && typeof value === "object") || typeof value === "function") {
            deepFreeze(value);
        }
    }

    return Object.freeze(object);
}

export function loadLanguage(lang: LanguageObject): void {
    if (lang.lang && languages[lang.name]) return;

    if (!languages[lang.name]) {
        loadLanguages([lang.name]);
    }

    // @ts-ignore
    Languages[lang.name as keyof typeof Languages].lang = languages[lang.name];
}