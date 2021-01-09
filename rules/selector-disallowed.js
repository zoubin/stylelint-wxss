const { utils } = require('stylelint')
const parser = require('postcss-selector-parser')

const namespace = require('../lib/namespace')
const VALID_SELECTORS = require('../lib/valid-selectors')
const walkRules = require('../lib/walkRules')
const createSelectorWalker = require('../lib/createSelectorWalker')

const name = 'selector-disallowed'
const ruleName = namespace(name)

function plugin(disallowedList) {
  const selectorWalker = createSelectorWalker(parser())

  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, { actual: disallowedList, possible: VALID_SELECTORS })
    if (!validOptions) return

    walkRules(root, selectorWalker((selector, rule) => {
      if (!disallowedList.includes(selector.type)) return
      const message = utils.ruleMessages(ruleName, {
        rejected: `Selector type disallowed: "${selector.type}" ("${selector.toString()}")`
      })
      utils.report({
        ruleName,
        result,
        node: rule,
        message: message.rejected
      })
    }))
  }
}
// https://stylelint.io/developer-guide/rules
plugin.primaryOptionArray = true
module.exports = plugin
