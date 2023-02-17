import { CodeTokenized } from "./types/common";
import hljs from "highlight.js";

export function parse(code: string): CodeTokenized {
    const result = hljs.highlightAuto(code);
    return {
        language: result.language,
        // @ts-ignore
        parts: res._emitter.rootNode.children
    };
}