{
  "presets": [
    "es2015",
    "es2017"
  ],
  "plugins": [
    "transform-es2015-destructuring",
    "transform-object-rest-spread",
    "syntax-async-functions"
  ]
}