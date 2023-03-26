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

### TypeScript types:
With <ins>TypeScript</ins>, it is likely that you will be *required* to install <ins>prismjs types<ins>.

So run the following command:
```shell
npm i -D @types/prismjs 
```

```shell
pnpm i -D @types/prismjs
```

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