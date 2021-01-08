const { utils } = require('stylelint')
const isKeyframeSelector = require('stylelint/lib/utils/isKeyframeSelector')
const isStandardSyntaxTypeSelector = require('stylelint/lib/utils/isStandardSyntaxTypeSelector');
const parser = require('postcss-selector-parser')
const namespace = require('../lib/namespace')
const name = 'selector-disallowed'
const ruleName = namespace(name)

const {
  TAG,
  //STRING = 'string';
  //SELECTOR = 'selector';
  //ROOT = 'root';
  PSEUDO,
  //NESTING = 'nesting';
  ID,
  COMMENT,
  COMBINATOR,
  CLASS,
  ATTRIBUTE,
  UNIVERSAL
} = parser
const VALID_SELECTORS = [ TAG, ID, CLASS, ATTRIBUTE, UNIVERSAL, PSEUDO, COMMENT, COMBINATOR ]


function plugin(primaryOption, secondaryOptionObject) {
  const processor = parser()

  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, { actual: primaryOption, possible: VALID_SELECTORS })
    if (!validOptions) return

    root.walkRules(rule => {
      processor.astSync(rule.selector).walk(selector => {
        if (isKeyframeSelector(selector.value)) {
          return;
        }
        if (selector.type===TAG && !isStandardSyntaxTypeSelector(selector)) {
          return;
        }
        if (primaryOption.includes(selector.type)) {
          const message = utils.ruleMessages(ruleName, {
            rejected: `Selector: "${selector.toString()}" is disallowed.`
          })
          utils.report({
            ruleName,
            result,
            node: rule,
            message: message.rejected
          })
        }
      })
    })
  }
}
// https://stylelint.io/developer-guide/rules
plugin.primaryOptionArray = true
module.exports = plugin
