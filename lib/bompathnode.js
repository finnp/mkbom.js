module.exports = BOMPathNode

// BOMPathInfo2
function BOMPathNode () {
  this.type = 'file'
  this.size = 0
  this.mode = 0
  this.uid = 0
  this.gid = 0
  this.checksum = 0
  this.linkName = ''
  this.name = ''
}

BOMPathNode.prototype.toBuffer = function () {
  var buf = new Buffer(31 + this.linkName.length)

  var pos = 0

  if (this.type === 'directory') {
    buf.writeUInt8(2, pos)
  } else if (this.type === 'file') {
    buf.writeUInt8(1, pos)
  } else {
    buf.writeUInt8(3, pos)
  }

  pos += 1

  // unknown0
  buf.writeUInt8(1, pos)
  pos += 1

  // architecture?
  buf.writeUInt16BE(3, pos)
  pos += 2

  // mode
  buf.writeUInt16BE(this.mode, pos)
  pos += 2

  // user
  buf.writeUInt32BE(this.uid, pos)
  pos += 4

  // group
  buf.writeUInt32BE(this.gid, pos)
  pos += 4

  // modtime ?
  buf.writeUInt32BE(0, pos)
  pos += 4

  buf.writeUInt32BE(this.size, pos)
  pos += 4

  // unknown1
  buf.writeUInt8(1, pos)
  pos += 1

  // checksum
  buf.writeUInt32BE(this.checksum, pos)
  pos += 4

  // link name
  buf.writeUInt32BE(this.linkName.length, pos)
  pos += 4

  buf.write(this.linkName, pos)

  return buf
}
