#!/usr/bin/env node

var mkbom = require('./')
var fs = require('fs')


var path = process.argv[2] || './'

var target = process.argv[3] || '/dev/null'

mkbom(path, function (stream) {
  stream.pipe(fs.createWriteStream(target))
})
