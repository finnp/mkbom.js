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
        var r = {}
        fs.lstat(file, function (err, stats) {
          if (err) return cb(err)
          r.name = './' + file.substr(dir.length)
          r.uid = stats.uid
          r.gid = stats.gid
          r.ug = stats.uid + '/' + stats.gid
          r.mode = stats.mode
          if (stats.isFile()) {
            r.size = stats.size
            pump(
              fs.createReadStream(file),
              cksum.stream(function (sum) {
                r.checksum = sum.readUInt32BE(0)
                cb(null, r)
              })
            )
          } else if (stats.isSymbolicLink()) {
            r.size = stats.size
            fs.readlink(file, function (err, linkName) {
              if (err) return cb(err)
              r.checksum = cksum(linkName).readUInt32BE(0)
              r.linkName = linkName
              cb(null, r)
            })
          } else {
            cb(null, r)
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
