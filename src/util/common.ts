import { tokenize, Grammar } from "prismjs";

export function parse(code: string, language: Grammar) {
  return tokenize(code.trim(), language);
}
