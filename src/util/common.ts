import { tokenize, Grammar } from "prismjs";

export function parse(code: string, language: Grammar) {
  return tokenize(code.trim(), language);
}

/**
 * Verify if a color is a hexadecimal color or not.
 * @param {string} color
 * @returns {boolean}
 */
export function isHexadecimalColor(color: string): boolean {
  return /^#([0-9a-f]{3}){1,2}$/i.test(color);
}

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