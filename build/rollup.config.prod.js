const path = require('path');
const { uglify } = require('rollup-plugin-uglify');
const config = require('./rollup.config');

const resolveFile = function(filePath) {
  return path.join(__dirname, '..', filePath)
}

config.output.sourcemap = false;
config.output.file = resolveFile('dist/vue-simple-clamp.min.js'),
config.plugins = [
  ...config.plugins,
  ...[
    uglify()
  ]
]

module.exports = config;
