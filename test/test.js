var mkbom = require('../')
var fs = require('fs')
var concat = require('concat-stream')
var assert = require('assert')
var path = require('path')
var bufferEqual = require('buffer-equal')
var test = require('tape')

test('equal to reference file', function (t) {

  t.plan(1)
  // refrence created by open source mkbom
  var bomref = fs.readFileSync(path.join(__dirname, 'Bom'))
  mkbom(path.join(__dirname, 'testdir'))
    .pipe(concat(function (bom) {
      t.ok(bufferEqual(bom, bomref), 'buffer equal')
    }))
})