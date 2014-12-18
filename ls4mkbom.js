#!/usr/bin/env node

var lsnodes = require('./lsnodes.js')

lsnodes(process.argv[2] || './', function (ls) {
  console.log(
    ls
    .map(function (l) {
      return JSON.stringify(l)
    })
    .join('\n')
  )
})