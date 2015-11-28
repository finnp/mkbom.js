module.exports = BOMVIndex

function BOMVIndex (index) {
  this.index = index // indexToVTree
}

BOMVIndex.prototype.toBuffer = function () {
  var buf = new Buffer(3 * 4 + 1)
  buf.fill()
  buf.writeUInt32BE(1, 0)
  buf.writeUInt32BE(this.index + 1, 4)

  return buf
}
