#!/usr/bin/env node

var lsr = require('ls-r')
var fs = require('fs')
var crc32 = require('./crc.js') // TODO: ordering problem with buffer-crc32?

lsr('.',  {}, function (err, stat) {
  stat.forEach(function (file) {
    if(file[0] !== '.') file = './' + file
    var line = file + '\t'
    var stats = fs.statSync(file)
    line += stats.mode.toString(8)
    line += '\t'
    line += stats.uid + '/' + stats.gid
    if(!stats.isDirectory()) {
      line += '\t'
      line += stats.size
      line += '\t'
      var contents = fs.readFileSync(file)
      line += crc32(contents).readUInt32BE(0)
    }
    console.log(line)
  })
})