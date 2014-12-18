module.exports = BOMPathNode

// BOMPathInfo2
function BOMPathNode() {
  this.type = 'file'
  this.size = 0
  this.mode = 0
  this.uid = 0
  this.gid = 0
  this.checksum = 0
  this.name = ''
}

BOMPathNode.prototype.toBuffer = function () {
  var buf = new Buffer(31 + this.name.length)

  var pos = 0

  if(this.type === 'directory') {
    buf.writeUInt8(1, pos)
  } else if (this.type === 'file') {
    buf.writeUInt8(2, pos)
  } else {
    buf.writeUInt8(3, pos)
  }
  
  pos += 1
  
  // unknown0
  buf.writeUInt8(1, pos)
  pos += 1
  
  // architecture?
  buf.writeUInt16LE(3, pos)
  pos += 2
  
  // mode
  buf.writeUInt16LE(this.mode, pos)
  pos += 2
  
  // user
  buf.writeUInt32LE(this.uid, pos)
  pos += 4
  
  // group
  buf.writeUInt32LE(this.gid, pos)
  pos += 4
  
  // modtime ?
  buf.writeUInt32BE(0, pos)
  pos += 4
  
  buf.writeUInt32LE(this.size, pos)
  pos += 4
  
  // unknown1
  buf.writeUInt8(1, pos)
  pos += 1
  
  // checksum
  buf.writeUInt32LE(this.checksum, pos)
  pos += 4
  
  // link name length / name
  buf.writeUInt32LE(this.name.length, pos)
  pos += 4
  
  buf.write(this.name, pos)
  
  return buf
  
}


// struct BOMPathInfo2 {
//   uint8_t type;           // See type enums above
//   uint8_t unknown0;       // = 1 (?)
//   uint16_t architecture;  // Not sure exactly what this means
//   uint16_t mode;
//   uint32_t user;
//   uint32_t group;
//   uint32_t modtime;
//   uint32_t size;
//   uint8_t unknown1;       // = 1 (?)
//   union {
//     uint32_t checksum;
//     uint32_t devType;
//   };
//   uint32_t linkNameLength;
//   char linkName[];
// } __attribute__((packed));

// 
// if (node.type == kDirectoryNode) {
//   info2->type = TYPE_DIR;
// } else if (node.type == kFileNode) {
//   info2->type = TYPE_FILE;
// } else {
//   info2->type = TYPE_LINK;
// }
// info2->unknown0 = 1;
// info2->architecture = htons(3); /* ?? */
// info2->mode = htons(node.mode);
// info2->user = htonl(node.uid);
// info2->group = htonl(node.gid);
// info2->modtime = 0;
// info2->size = htonl(node.size);
// info2->unknown1 = 1;
// info2->checksum = htonl(node.checksum);
// info2->linkNameLength = htonl(node.linkNameLength);
// strcpy( info2->linkName, node.linkName.c_str() );
