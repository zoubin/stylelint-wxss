const { test } = require('tap')
const parser = require('postcss-selector-parser')

const createSelectorWalker = require('../lib/createSelectorWalker')
const selectorWalker = createSelectorWalker(parser())

test('normal selector', t => {
  const selectors = []
  selectorWalker((selector, rule) => {
    selectors.push(selector)
  })({ selector: 'input' })
  t.equal(selectors.length, 1)
  t.end()
})

test(':nth-child selector', t => {
  const selectors = []
  selectorWalker((selector, rule) => {
    selectors.push(selector)
  })({ selector: 'input:nth-child(2)' })
  t.equal(selectors.length, 2)
  t.end()
})
