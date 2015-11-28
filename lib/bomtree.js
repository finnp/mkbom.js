module.exports = BOMTree

function BOMTree (pathCount) {
  this.pathCount = pathCount
  this.blockSize = 4096 // default
  this.child = null
}

BOMTree.prototype.toBuffer = function () {
  var buf = new Buffer(5 * 4 + 1)

  var pos = 0
  buf.write('tree', pos); pos += 4

  buf.writeUInt32BE(1, pos); pos += 4

  buf.writeUInt32BE(this.child + 1, pos); pos += 4

  buf.writeUInt32BE(this.blockSize, pos); pos += 4

  buf.writeUInt32BE(this.pathCount, pos); pos += 4

  buf.writeUInt8(0, pos)

  return buf
}
