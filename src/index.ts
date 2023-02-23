import Prism from "prismjs";
import { draw, parse } from "./util/common";

draw(
    parse(`
    const compose = (...fns) => res => fns.reduce((accum, next) => next(accum), res);
const test = true;
const pluckDeep = key => test;

if (test) console.log(false);

const bj = 1;
const tj = "test";
`, Prism.languages.javascript),
    700
);