const { utils } = require('stylelint')

const namespace = require('../lib/namespace')
const VALID_SELECTORS = require('../lib/valid-selectors')
const walkRules = require('../lib/walkRules')
const createSelectorWalker = require('../lib/createSelectorWalker')

const name = 'selector-disallowed'
const ruleName = namespace(name)

function isNestedFalsyTag(selector) {
  if (selector.type !== 'tag') return false
  let prev = selector.prev()
  return prev && prev.type === 'nesting'
}

function plugin(disallowedList, options = {}) {
  const exclude = options.exclude || {}
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, { actual: disallowedList, possible: VALID_SELECTORS })
    if (!validOptions) return

    walkRules(root, createSelectorWalker((selector, rule) => {
      // ignore `&__input`
      // leave the task of checking `&` elsewhere
      if (isNestedFalsyTag(selector)) return
      if (!disallowedList.includes(selector.type)) return
      if (
        exclude[selector.type] &&
        exclude[selector.type].includes(
          selector.value || selector._value || selector._attribute
        )
      ) return
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
