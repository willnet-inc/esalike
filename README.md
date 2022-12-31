*** WARNING: esarea has problems with the usage of esarea ***

# esalike

An [esa.io](https://esa.io) like markdown input support provided as a NPM package.

This package imported core features from [esarea](https://github.com/fukayatsu/esarea) and is rewritten with TypeScript.


## How to use

Install this package first.

```bash
npm install esalike
```

Use `ApplyMarkdownInputAssist` function to apply esalike's markdown input support.

```typescript
import { ApplyMarkdownInputAssist } from 'esalike';

const editor = document.getElementById('YOUR_TEXTAREA_ID') as HTMLTextAreaElement;

ApplyMarkdownInputAssist(editor);
```

## Supported browsers

The latest versions of Chrome and Firefox.

## Demo & Development

You can try the demo app in this repo to see how esalike works.

```bash
npm install
npm run dev # Open http://localhost:3000
```

`npm run dev` builds both esalike package and the demo app. The command also keeps watching files for both directories to support development.
