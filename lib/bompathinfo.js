module.exports = BOMPathInfo

function BOMPathInfo(id) {

  this.id = id || 0
  this.index = 0

  // OMPathInfo1 info1;
  // info1.id = htonl( j + 1 );
  // info1.index = htonl(bom.addBlock(info2, bom_path_info2_size));

}

BOMPathInfo.prototype.toBuffer = function () {
  var buf = new Buffer(4 + 4)
  buf.writeUInt32LE(this.id, 0)
  buf.writeUInt32LE(this.index, 4)
  return buf
}

// 
// struct BOMPathInfo1 {
//   uint32_t id;
//   uint32_t index;   // Pointer to BOMPathInfo2
// } __attribute__((packed));