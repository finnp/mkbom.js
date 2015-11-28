module.exports = BOMFile

function BOMFile () {
  this.parent = null
  this.name = ''
}

BOMFile.prototype.toBuffer = function () {
  this.name = this.name || '.'
  var buf = new Buffer(4 + this.name.length + 1)
  // TODO: fix this elsewhere?
  if (!this.parent) {
    if (this.name === '.') this.parent = 0
    else this.parent = 1
  }
  buf.writeUInt32BE(this.parent, 0)
  buf.write(this.name + '\0', 4)
  return buf
}
