module.exports = {
  plugins: ['../'],
  rules: {
    'wxss/selector-disallowed': [['tag', 'attribute'], {
      exclude: { tag: ['page'] }
    }],
    //'wxss/selector-allowed': ['class']
  }
}
