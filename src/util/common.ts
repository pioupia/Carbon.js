import Prism, { Grammar } from "prismjs";

export function parse(code: string, language: Grammar) {
  return Prism.tokenize(code.trim(), language);
}
