const path = require('path');
const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');

const resolveFile = function(filePath) {
  return path.join(__dirname, '..', filePath)
}

module.exports = {
  moduleName: 'clamp',
  input: resolveFile('src/index.js'),
  output: {
    format: 'umd',
  },
  dest: 'dist/vue-simple-clamp.js',
  plugins: [
    babel({
      "presets": [
        ["@babel/preset-env"],
      ],
      "plugins": [
        "transform-object-rest-spread"
      ],
    }),
    resolve()
  ],
}
