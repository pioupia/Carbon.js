# CarbonImage
This npm package allows you to transform your code into an Image, like: https://carbon.vercel.app.

> This package **can only run** on the <ins>server side</ins> of your app.

## Installation
You have to use your favorite package manager like [npm](https://www.npmjs.com/), [pnpm](https://pnpm.io/) or [yarn](https://yarnpkg.com/) to install `carbonimg`.

```shell
npm i carbonimg@latest
```

```shell
pnpm i carbonimg@latest
```

`carbonimg` Uses the following packages: [`canvas`](https://www.npmjs.com/package/canvas), and [`prismjs`](https://www.npmjs.com/package/prismjs). So the package is quite light by default.

## Quick Example
```javascript
const fs = require("node:fs");
const { Languages, render } = require("carbonimg");

const code = `
const pluckDeep = key => obj => key.split('.').reduce((accum, key) => accum[key], obj)

const compose = (...fns) => res => fns.reduce((accum, next) => next(accum), res)

const unfold = (f, seed) => {
  const go = (f, seed, acc) => {
    const res = f(seed)
    return res ? go(f, res[1], acc.concat([res[0]])) : acc
  }
  return go(f, seed, [])
}
`;
const out = fs.createWriteStream(__dirname + '/test.jpeg');

const canvas = render(code, Languages.javascript); // Will return the Canvas image.
const stream = canvas.createJPEGStream({
    quality: 1,
    chromaSubsampling: false
});
stream.pipe(out);
out.on('finish', () =>  console.log('The JPEG file was created.'));
```

## Render function:

```ts
render(code: string, language: Grammar, customTheme?: ThemeBuilder, customWidth?: number): Canvas
```

* code – The code you want to render.
* language – The programming language used.
* customTheme – The custom theme you want to apply to this image.
* customWidth – The custom with of the image (default: 750px)



## Create theme:
Since version `1.4.0-BETA`, you can create a theme with the constructor `ThemeBuilder`.

For example:
```typescript
import { ThemeBuilder } from "carbonimg";

const theme = new ThemeBuilder();
theme.setColor("backgroundColor", "#28211c") // Set the new Window Background color
    .setColor("defaultForegroundColor", "#baae9e") // Set the default color of the text
    .setColor("keyword", "#5ea6ea") // Set the new 'keyword' color
    .setFontSize(20) // Set the font-size to 20.
    .setFontFamily("./Gravity-Bold.otf", "Gravity Bold") // Change the font to Gravity-Bold
    // /!\ The path is relative to the root of the project /!\
    .setColor("string", "#54be0d");

// Now, use the theme :
const code = "const newVersion = 'My beautiful custom theme!';";
const out = fs.createWriteStream(__dirname + '/code.jpeg');

const canvas = render(code, Languages.javascript, theme);
const stream = canvas.createJPEGStream({
    quality: 1,
    chromaSubsampling: false
});
stream.pipe(out);
out.on('finish', () =>  console.log('The image was successfully rendered!'));
```

The `ThemeBuilder` class can take an optional theme object as parameter, to avoid using the above methods.

But it is not possible to apply a custom font (a font file that is not installed as a font on the system) by this object.