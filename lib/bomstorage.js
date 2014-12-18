var readable = require('stream-wrapper').readable

module.exports = BOMStorage

function BOMStorage() {
  
  this.vars = []
  this.entries = []
  
}

BOMStorage.prototype.getHeader = function (size_of_vars, size_of_header, size_of_free_list) {

  var entry_size = this.entries
    .reduce(function (acc, buf) {
      if(!Buffer.isBuffer(buf)) buf = buf.toBuffer()
      return buf.length + acc
    }, 0)
  
  var size_of_block_table = 4 + this.entries.length * 8 // BOMPointer (adress + length)


  var headerInfo = {
    magic: "BOMStore",
    version: 1,
    numberOfBlocks: this.entries.length,
    indexOffset: size_of_header + size_of_vars + entry_size,
    indexLength: size_of_block_table + size_of_free_list,
    varsOffset: size_of_header,
    varsLength: size_of_vars
  }
  
  // binary format
  var header = new Buffer(size_of_header)
  header.fill(0)
  header.write(headerInfo.magic, 0)
  header.writeUInt32BE(headerInfo.version, 2*4)
  header.writeUInt32BE(headerInfo.numberOfBlocks, 3*4)
  header.writeUInt32BE(headerInfo.indexOffset, 4*4)
  header.writeUInt32BE(headerInfo.indexLength, 5*4)
  header.writeUInt32BE(headerInfo.varsOffset, 6*4)
  header.writeUInt32BE(headerInfo.varsLength, 7*4)
  
  return header
}

BOMStorage.prototype.getVars = function (size_of_vars) {
  // Vars toBuffer
  var vars = new Buffer(size_of_vars)
  var pos = 0
  vars.writeUInt32BE(this.vars.length, pos); pos += 4
  this.vars.forEach(function (vari) {
    vars.writeUInt32BE(vari.index, pos); pos += 4
    vars.writeUInt8(vari.name.length, pos); pos += 1
    vars.write(vari.name, pos); pos += vari.name.length
  })

  return vars
}


BOMStorage.prototype.getBlock = function (index) {
  return this.entries[index]
}

BOMStorage.prototype.addBlock = function (data) {
  if(!(Buffer.isBuffer(data) || data.toBuffer)) throw new Error('Invalid block')
  this.entries.push(data)
  return this.entries.length - 1 // index
}

BOMStorage.prototype.addVar = function (name, data) {
  var index = this.addBlock(data)
  this.vars.push({name: name, index: index})
}

BOMStorage.prototype.createReadStream = function () {
  var self = this
  var started = false
  return readable(function () {
    if(started) return
    started = true

    var size_of_vars = self.vars.reduce(function (acc, vari) {
      return 4 + 1 + vari.name.length + acc
    }, 4)
    var size_of_header = 512
    
    var size_of_free_list = 4 + ( 2 * 8 )
    
    // convert entries to buffers
    self.entries = self.entries.map(function (entry) {
      if(Buffer.isBuffer(entry)) return entry
      return entry.toBuffer()
    })

    this.push(self.getHeader(size_of_vars, size_of_header, size_of_free_list))
    this.push(self.getVars(size_of_vars))

    self.entries.forEach(function (buf) {
      this.push(buf)
    }.bind(this))
    // block table
    self.entries.reduce(function (address, buf) {
      // if != buf buf.toBuffer()
      address = buf.length + address
      var blockEntry = new Buffer(8)
      blockEntry.writeUInt32BE(address, 0)
      blockEntry.writeUInt32BE(buf.length, 4)
      this.push(blockEntry)
      return address
    }.bind(this), size_of_header + size_of_vars)
    // free list
    var freeList = new Buffer(size_of_free_list)
    freeList.writeUInt32BE(2, 0) // 2 entries
    freeList.writeUInt32BE(0, 1 * 4) // adress
    freeList.writeUInt32BE(0, 2 * 4) // length
    freeList.writeUInt32BE(0, 3 * 4) // adress
    freeList.writeUInt32BE(0, 4 * 4) // length 
    this.push(freeList)
  })
}
