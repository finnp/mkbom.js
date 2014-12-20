#!/usr/bin/env node

var mkbom = require('./')
var fs = require('fs')

if(process.argv.length <= 2) {
  console.error('usage: mkbomjs <path> [bomfile] ')
  process.exit()
}

var path = process.argv[2] || './'

var target = process.argv[3]

mkbom(path, function (stream) {
  var output = target ? fs.createWriteStream(target) : process.stdout
  stream.pipe(output)
})
