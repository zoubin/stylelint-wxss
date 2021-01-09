const parser = require('postcss-selector-parser')

const {
  SELECTOR,
  STRING,
  ROOT,
  NESTING,
  COMMENT,

  COMBINATOR,

  TAG,
  PSEUDO,
  ID,
  CLASS,
  ATTRIBUTE,
  UNIVERSAL
} = parser

module.exports = [
  TAG, ID, CLASS, ATTRIBUTE, PSEUDO, UNIVERSAL,
  SELECTOR, COMMENT, COMBINATOR
]

