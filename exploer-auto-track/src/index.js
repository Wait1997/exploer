const path = require('path');
const fs = require('fs');
const { transformFromAstSync } = require('@babel/core');
const parser = require('@babel/parser');
const autoTrackPlugin = require('./plugin/auto-track-plugin');

const codePath = path.join(__dirname, './sourceCode.js');
const sourceCode = fs.readFileSync(codePath, { encoding: 'utf-8' });
const ast = parser.parse(sourceCode, { sourceType: 'unambiguous' });

const { code } = transformFromAstSync(ast, sourceCode, {
  plugins: [
    [
      autoTrackPlugin,
      {
        trackerPath: 'tracker'
      }
    ]
  ]
});

console.log(code);
