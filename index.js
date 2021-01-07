const { createPlugin } = require('stylelint')
const rules = require('./rules')
const namespace = require('./lib/namespace')

module.exports = Object.keys(rules).map(ruleName => {
  return createPlugin(namespace(ruleName), rules[ruleName])
})
