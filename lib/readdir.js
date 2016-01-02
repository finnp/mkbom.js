var fs = require('fs')
var parallel = require('run-parallel')
var path = require('path')

module.exports = lsr

function lsr (dir, cb) {
  var result = [dir]
  loop(dir, function (err) {
    if (err) return cb(err)
    cb(null, result)
  })

  function loop (dir, cb) {
    fs.readdir(dir, function (err, files) {
      if (err) return cb(err)
      var recurse = files
        .map(function (file) {
          return path.join(dir, file)
        })
        .map(function (file) {
          result.push(file)
          return function (cb) {
            fs.lstat(file, function (err, stat) {
              if (err) return cb(err)
              if (stat.isDirectory()) {
                loop(file, cb)
              } else {
                cb()
              }
            })
          }
        })
      parallel(recurse, cb)
    })
  }
}
