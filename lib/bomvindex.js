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


// BOMVIndex vindex
// vindex.unknown0 = htonl(1)
// vindex.indexToVTree = htonl( bom.addBlock( &tree, sizeof(BOMTree) ) )
// vindex.unknown2 = htonl(0)
// vindex.unknown3 = 0
//   
//   struct BOMVIndex {
//     uint32_t unknown0      // Always 1
//     uint32_t indexToVTree
//     uint32_t unknown2      // Always 0
//     uint8_t unknown3       // Always 0
//   } __attribute__((packed))
// }
}
