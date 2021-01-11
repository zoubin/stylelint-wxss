const parser = require('postcss-selector-parser')
const processor = parser()

module.exports = callback => rule => {
  const walk = node => {
    // do not handle containers
    if (!['selector', 'root'].includes(node.type)) {
      callback(node, rule)
    }

    // :nth-child(3) will detect 3 as a tag name selector
    if (node.type === 'pseudo') return

    if (node.each) {
      node.each(walk)
    }
  }
  const root = processor.astSync(rule.selector)
  walk(root)
}
