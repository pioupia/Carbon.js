import Prism from "prismjs";
import { draw, parse } from "./util/common";

draw(
    parse(`
const test = true;
const pluckDeep = key => test;

if (test) console.log(false);
    
const bj = 1;
const tj = "test";
`, Prism.languages.javascript),
    700
);