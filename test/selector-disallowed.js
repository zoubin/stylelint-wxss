const path = require('path')
const { test, only } = require('tap')
const { lint } = require('stylelint')
const config = {
  plugins: ['../'],
  rules: {
    'wxss/selector-disallowed': ['tag', 'id', 'attribute']
  }
}

test('invalid options', async function (t) {
  const { results: [ { invalidOptionWarnings } ] } = await lint({
    configBasedir: __dirname,
    code: '.input #input { height: 15px; }',
    config: {
      plugins: ['../'],
      rules: {
        'wxss/selector-disallowed': ['nonexisting']
      }
    }
  })
  t.equal(invalidOptionWarnings.length, 1)
})

test('allowed selectors', async function (t) {
  const code = [
    '.container { height: 15px; }',
    '.abc .container { height: 15px; }',
    '.abc > .container { height: 15px; }',
    '.abc, .container { height: 15px; }',
    '.abc.container { height: 15px; }',
  ].join('\n')

  const {
    results: [ { errored, warnings, parseErrors } ]
  } = await lint({ configBasedir: __dirname, code, config })

  t.notOk(errored)
  t.equal(warnings.length, 0)
  t.equal(parseErrors.length, 0)
})

test('nested falsy tags', async function (t) {
  const code = `
   .form {
     &__input {
       color: red;
     }
     input {
       color: green;
     }
   }
  `

  const {
    results: [ { errored, warnings, parseErrors } ]
  } = await lint({ configBasedir: __dirname, code, config })

  t.ok(errored)
  t.equal(warnings.length, 1)
  t.equal(parseErrors.length, 0)
})

test('disallowed selectors', async function (t) {
  const code = [
    'input { height: 15px; }',
    '.input #input { height: 15px; }',
    '[href].input { height: 15px; }'
  ]

  const {
    results: [ { errored, warnings, parseErrors } ]
  } = await lint({ configBasedir: __dirname, code: code.join('\n'), config })

  t.ok(errored)
  t.equal(warnings.length, code.length)
  t.equal(parseErrors.length, 0)
})

test('string primary options', async function (t) {
  const { results: [ { invalidOptionWarnings } ] } = await lint({
    configBasedir: __dirname,
    code: '.input #input { height: 15px; }',
    config: {
      plugins: ['../'],
      rules: {
        'wxss/selector-disallowed': 'tag'
      }
    }
  })
  t.equal(invalidOptionWarnings.length, 0)
})

test('scss', async function (t) {
  const {
    results: [ { errored, warnings, parseErrors } ]
  } = await lint({ configBasedir: __dirname, files: path.join(__dirname, 'fixture/selector-disallowed.scss'), config })

  t.ok(errored)
  t.equal(warnings.length, 1)
  t.equal(parseErrors.length, 0)
})

