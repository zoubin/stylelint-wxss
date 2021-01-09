const createRulesWalker = filter => (root, callback) => {
  root.walkRules(rule => {
    if (!filter(rule)) return
    callback(rule)
  })
}

exports = module.exports = createRulesWalker(rule => {
  // @keyframes 中的 0% 会被识别为 tag
  if (rule.parent && rule.parent.name === 'keyframes') return
  return true
})

exports.createRulesWalker = createRulesWalker
