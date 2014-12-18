module.exports = BOMTree

function BOMTree(pathCount) {
  this.pathCount = pathCount
  this.blockSize = 4096 // default
  this.child = null
}

BOMTree.prototype.toBuffer = function () {
  var buf = new Buffer(5 * 4 + 1)
  
  var pos = 0
  buf.write("tree", pos); pos += 4
  
  buf.writeUInt32LE(1, pos); pos += 4
  
  buf.writeUInt32LE(this.blockSize, pos); pos +=4
  
  buf.writeUInt32LE(this.pathCount, pos); pos += 4
  
  buf.writeUInt8(0, pos)
  
  return buf

  // memcpy( tree.tree, "tree", 4 );
  // tree.version = htonl(1);
  // tree.blockSize = htonl( 4096 );
  // tree.pathCount = htonl( num );
  // tree.unknown3 = 0; /* ?? */
  // struct BOMTree {
  //   char tree[4];         // Always "tree"
  //   uint32_t version;     // Always 1
  //   uint32_t child;       // Index for BOMPaths
  //   uint32_t blockSize;   // Always 4096
  //   uint32_t pathCount;   // Total number of paths in all leaves combined
  //   uint8_t unknown3;
  // } __attribute__((packed));
}