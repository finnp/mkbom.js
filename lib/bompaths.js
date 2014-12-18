module.exports = BOMPaths

function BOMPaths(num_paths) {
  this.isLeaf = false
  this.count = num_paths || 0
  this.forward = 0
  this.backward = 0
  this.indices = []
  // root_paths->indices[current_path].index0 = htonl(new_paths_id);
}

BOMPaths.prototype.setIndex = function(type, pos, value) {
  if(!this.indices[pos]) this.indices[pos] = {}
  if(type === 0)
    this.indices[pos].index0 = value
  else
    this.indices[pos].index1 = value
}

BOMPaths.prototype.toBuffer = function () {
  
  var buf = new Buffer(2 * 2 + 2 * 4 + 8 * this.indices.length)
  var pos = 0
  
  buf.writeUInt16LE(this.isLeaf, pos); pos += 2
  buf.writeUInt16LE(this.count, pos); pos += 2
  
  buf.writeUInt32LE(this.forward, pos); pos += 4
  buf.writeUInt32LE(this.backward, pos); pos += 4
  
  // indices
  this.indices.forEach(function (index) {
    buf.writeUInt32LE(index.index0, pos); pos += 4
    buf.writeUInt32LE(index.index1, pos); pos += 4
  })
  
  return buf
  // struct BOMPaths {
  //   uint16_t isLeaf;
  //   uint16_t count;
  //   uint32_t forward;
  //   uint32_t backward;
  //   BOMPathIndices indices[];
  // } __attribute__((packed));
  
  // struct BOMPathIndices {
  //   uint32_t index0; /* for leaf: points to BOMPathInfo1, for branch points to BOMPaths */
  //   uint32_t index1; /* always points to BOMFile */
  // } __attribute__((packed));
  // 

}