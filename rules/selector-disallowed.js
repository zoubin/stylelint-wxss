const { utils } = require('stylelint')
const isKeyframeRule = require('stylelint/lib/utils/isKeyframeRule')

const namespace = require('../lib/namespace')
const VALID_SELECTORS = require('../lib/valid-selectors')
const walkRules = require('../lib/walkRules')
const createSelectorWalker = require('../lib/createSelectorWalker')
const multimatch = require('multimatch')

const name = 'selector-disallowed'
const ruleName = namespace(name)

function isNestedFalsyTag(selector) {
  if (selector.type !== 'tag') return false
  let prev = selector.prev()
  return prev && prev.type === 'nesting'
}

function plugin(disallowedList, { exclude = Object.create(null), glob } = {}) {
  return (root, result) => {
    if (glob && !multimatch(root.source.input.file, glob).length) return

    const validOptions = utils.validateOptions(result, ruleName, { actual: disallowedList, possible: VALID_SELECTORS })
    if (!validOptions) return

    walkRules(root, createSelectorWalker((selector, rule) => {
      // ignore `&__input`
      // leave the task of checking `&` elsewhere
      if (isNestedFalsyTag(selector)) return
      // 如果当前规则在 @keyframes 内，就直接返回
      if (isKeyframeRule(rule)) {
        return;
      }
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
