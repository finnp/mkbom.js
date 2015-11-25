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

// unsigned int bom_file_size = sizeof(uint32_t) + 1 + s.size()
// BOMFile * f = (BOMFile*)malloc( bom_file_size )
// f->parent = htonl( parent )
// strcpy( f->name, s.c_str() )
// paths->indices[k].index1 = last_file_info = htonl( bom.addBlock( f, bom_file_size ) )
// free( (void*) f )

// struct BOMFile {
//   uint32_t parent;  // Parent BOMPathInfo1->id
//   char name[]
// } __attribute__((packed))
