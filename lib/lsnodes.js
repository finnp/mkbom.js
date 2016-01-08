var fs = require('fs')
var cksum = require('cksum')
var pump = require('pump')
var parallel = require('run-parallel')
var lsr = require('./readdir')

module.exports = function (dir, cb) {
  if (dir[dir.length - 1] !== '/') dir += '/'
  lsr(dir, function (err, stat) {
    if (err) return cb(err)
    var ls = stat.map(function (file) {
      return function (cb) {
        fs.lstat(file, function (err, stats) {
          if (err) return cb(err)
          stats.name = './' + file.substr(dir.length)
          stats.ug = stats.uid + '/' + stats.gid
          if (stats.isFile()) {
            pump(
              fs.createReadStream(file),
              cksum.stream(function (sum) {
                stats.checksum = sum.readUInt32BE(0)
                cb(null, stats)
              })
            )
          } else if (stats.isSymbolicLink()) {
            fs.readlink(file, function (err, linkName) {
              if (err) return cb(err)
              stats.checksum = cksum(linkName).readUInt32BE(0)
              stats.linkName = linkName
              cb(null, stats)
            })
          } else {
            cb(null, stats)
          }
        })
      }
    })
    parallel(ls, function (err, result) {
      if (err) return cb(err)
      cb(null, result)
    })
  })
}
