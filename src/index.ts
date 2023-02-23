import Prism from "prismjs";
import { draw, parse } from "./util/common";

draw(
    parse(`const \ntest \n= true;\n\nconst truc = false;`, Prism.languages.javascript),
    700
);