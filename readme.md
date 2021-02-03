# stylelint-wxss
A collection of WXSS specific linting rules for [stylelint](https://github.com/stylelint/stylelint) (in a form of plugin).

## Installation and usage

```bash
npm install stylelint stylelint-wxss

```

Create the configuration file `stylelint.config.js`:
```js
module.exports = {
  plugins: ['stylelint-wxss'],
  rules: {
    'wxss/selector-disallowed': ['tag']
  }
}

```

### `options.exclude`
```js
module.exports = {
  plugins: ['stylelint-wxss'],
  rules: {
    'wxss/selector-disallowed': [['tag'], {
      exclude: {
        tag: ['page']
      }
    }]
  }
}

```

### `options.glob`
`glob` options: [multimatch](https://github.com/sindresorhus/multimatch#globbing-patterns)
```js
module.exports = {
  plugins: ['stylelint-wxss'],
  rules: {
    'wxss/selector-disallowed': [['tag'], {
      // skip lint files under component directory
      glob: ['**', '!**/component/**']
    }]
  }
}

```

## List of rules

### wxss/selector-disallowed
To disable specific selector types.
