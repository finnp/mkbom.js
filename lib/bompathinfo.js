module.exports = BOMPathInfo

function BOMPathInfo (id) {
  this.id = id || 0
  this.index = 0
}

BOMPathInfo.prototype.toBuffer = function () {
  var buf = new Buffer(4 + 4)
  buf.writeUInt32BE(this.id, 0)
  buf.writeUInt32BE(this.index + 1, 4)
  return buf
}
