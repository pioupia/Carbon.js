import Prism from "prismjs";
import { draw, parse } from "./util/common";

draw(
    parse(`
    const \ntest \n= true;\n\nconst truc = false;
const pluckDeep = key => obj => oj;
    
const bj = 1;
const tj = "test";
`, Prism.languages.javascript),
    700
);