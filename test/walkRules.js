const { test } = require('tap')
const parser = require('postcss-selector-parser')
const postcss = require('postcss')
const walkRules = require('../lib/walkRules')

test('keyframes', t => {
  const rules = []
  const root = postcss.parse(`
    @keyframes animation {
      0% {
        transform: scale(0.99);
      }
      100% {
        transform: scale(1.01);
      }
    }
  `)
  walkRules(root, rule => rules.push(rule))
  t.equal(rules.length, 0)
  t.end()
})

test('normal', t => {
  const rules = []
  const root = postcss.parse(`
    input {
      color: red;
    }
  `)
  walkRules(root, rule => rules.push(rule))
  t.equal(rules.length, 1)
  t.end()
})
