const { transformFileSync } = require('@babel/core');
const parametersInsertPlugin = require('./plugin/paramters-insert-plugin');
const path = require('path');

const { code } = transformFileSync(path.join(__dirname, './sourceCode.js'), {
  plugins: [parametersInsertPlugin],
  parserOpts: {
    sourceType: 'unambiguous',
    plugins: ['jsx']
  }
});

console.log(code);
