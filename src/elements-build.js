const fs = require('fs-extra');
const concat = require('concat');
(async function build() {
  const files = [
    './dist/sctl-graph/scripts.js',
  //  './dist/ncats-graph/polyfills.js',
    './dist/sctl-graph/main.js'
  ]
  await fs.ensureDir('elements')
  await concat(files, 'elements/ncats-graph.js');
  await fs.copy('./dist/sctl-graph/assets/', 'elements/assets/' )

})()
