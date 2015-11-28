#!/usr/bin/env node

var mkbom = require('./')
var argv = require('minimist')(process.argv.slice(2))
var fs = require('fs')

if (process.argv.length <= 2) {
  console.error('usage: mkbomjs <path> [bomfile] ')
  process.exit()
}

var path = argv._[0] || './'

var target = argv._[1]

var opts = {}
if (argv.u) opts.uid = Number(argv.u)
if (argv.g) opts.gid = Number(argv.g)
var output = target ? fs.createWriteStream(target) : process.stdout

mkbom(path, opts).pipe(output)
