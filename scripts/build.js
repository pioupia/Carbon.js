const { join } = require("path");
const fs = require("node:fs");

const sourceFile = join('.', 'dist', 'cjs', 'index.js');
const text = fs.readFileSync(sourceFile, { encoding: "utf8" });
fs.writeFileSync(sourceFile, text
    .replaceAll("module.exports.default ", "module.exports ")
    .replaceAll("exports.default ", "module.exports ")
        .replaceAll("exports.", "module.exports.")
    , { encoding: "utf8" });