const { transformAsync } = require('@babel/core');

const babelConfig = {
    plugins: ['./index.js']
};

const preCode = `
 const a = 1;
 const b = 2;
 const c = a + b/2;
 console.log(1.567 + 2.33)
`

transformAsync(preCode, babelConfig).then(res => {
    const { code, map, ast } = res;
    console.log(code);
})
