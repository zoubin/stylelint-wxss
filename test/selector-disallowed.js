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

test('disallowed selectors with exclude', async function (t) {
  const code = [
    'input { height: 15px; }',
    '.container { height: 15px; }',
    '[href] { height: 15px; }'
  ].join('\n')
  const {
    results: [ { errored, warnings, parseErrors } ]
  } = await lint({
    configBasedir: __dirname, code,
    config: {
      plugins: ['../'],
      rules: {
        'wxss/selector-disallowed': [ ['tag', 'class', 'attribute'], {
          exclude: {
            tag: ['input'],
            class: ['container'],
            attribute: ['href'],
          }
        }]
      }
    }
  })

  t.notOk(errored)
  t.equal(warnings.length, 0)
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

test('glob', async function (t) {
  const {
    results: [ result1, result2 ]
  } = await lint({
    configBasedir: __dirname,
    files: [
      path.join(__dirname, 'fixture/selector-disallowed.scss'),
      path.join(__dirname, 'fixture/component/selector-disallowed.scss')
    ],
    config: {
      plugins: ['../'],
      rules: {
        'wxss/selector-disallowed': [['tag'], {
          glob: ['**/component/**']
        }]
      }
    }
  })

  t.ok(!result1.errored)
  t.equal(result1.warnings.length, 0)
  t.equal(result1.parseErrors.length, 0)
  t.ok(result2.errored)
  t.equal(result2.warnings.length, 2)
  t.equal(result2.parseErrors.length, 0)
})


test('@keyframes selectors should not trigger the rule', async function (t) {
  const {
    results: [ result ]
  } = await lint({
    configBasedir: __dirname,
    code: `
      @keyframes loading-animation {
        0% {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(1turn);
        }
      }
      view {
        animation: loading-animation 2s infinite linear;
      }
    `,
    config: {
      plugins: ['../'],
      rules: {
        'wxss/selector-disallowed': [['tag'],{
          componentOnly: true,
          severity: 'error',
          exclude: {
            tag: ['view'],
          },
        },]
      }
    }
  })

  // 我们只关心这个CSS是否没有错误
  t.ok(!result.errored)
  t.equal(result.warnings.length, 0)   // 确保没有警告
  t.equal(result.parseErrors.length, 0) // 确保没有解析错误
})
