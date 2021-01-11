const isKeyframeRule = require('stylelint/lib/utils/isKeyframeRule')

const createRulesWalker = filter => (root, callback) => {
  root.walkRules(rule => {
    if (!filter(rule)) return
    callback(rule)
  })
}

exports = module.exports = createRulesWalker(rule => {
  // @keyframes 中的 0% 会被识别为 tag
  if (isKeyframeRule(rule)) return
  return true
})

exports.createRulesWalker = createRulesWalker
