module.exports = ['selector-disallowed'].reduce((rules, next) => {
  rules[next] = require(`./${next}`)
  return rules
}, {})
