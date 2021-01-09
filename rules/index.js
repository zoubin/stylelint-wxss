const ruleNames = [
  'selector-disallowed'
]
module.exports = ruleNames.reduce((rules, next) => {
  rules[next] = require(`./${next}`)
  return rules
}, {})
