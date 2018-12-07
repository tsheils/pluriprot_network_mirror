
const fs = require('fs-extra');
const concat = require('concat');
(async function build() {
  const files = [
    './dist/sctl-graph/runtime.js',
    './dist/sctl-graph/polyfills.js',
     './dist/sctl-graph/scripts.js',
    './dist/sctl-graph/main.js'
  ]

  await fs.ensureDir('elements')
  await concat(files, 'elements/sctl-graph.js');
  await fs.copyFile('./dist/sctl-graph/styles.css', 'elements/styles.css')
  await fs.copy('./dist/sctl-graph/assets/', 'elements/assets/' )

})()
