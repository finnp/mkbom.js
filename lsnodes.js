var lsr = require('ls-r')
var fs = require('fs')
var crc32 = require('./crc.js') // TODO: ordering problem with buffer-crc32?

module.exports = function (dir, cb) {
  // TODO: rewrite dir to ./ if !== ./
  if(dir[dir.length-1] != '/') dir += '/'  

  lsr(dir,  {}, function (err, stat) {
    if(err) return cb(err)
    var ls =  stat.map(function (file) {
      var r = {}
      var stats = fs.statSync(file)
      r.name = './' + file.substr(dir.length)
      r.uid = stats.uid
      r.gid = stats.gid
      r.ug = stats.uid + '/' + stats.gid
      r.mode = stats.mode
      if(!stats.isDirectory()) {
        r.size = stats.size
        var contents = fs.readFileSync(file)
        r.checksum = crc32(contents).readUInt32BE(0)
      }
      return r
    })
    cb(ls)
  })
}
