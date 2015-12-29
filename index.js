var p = require('path')
var readonly = require('read-only-stream')
var PassThrough = require('stream').PassThrough
var lsnodes = require('./lib/lsnodes.js')
var BOMStorage = require('./lib/bomstorage.js')
var BOMPaths = require('./lib/bompaths.js')
var BOMPathNode = require('./lib/bompathnode.js')
var BOMPathInfo = require('./lib/bompathinfo.js')
var BOMFile = require('./lib/bomfile.js')
var BOMTree = require('./lib/bomtree.js')
var BOMVIndex = require('./lib/bomvindex.js')

module.exports = write_bom

function write_bom (path, opts) {
  opts = opts || {}
  path = p.resolve(path)
  var output = new PassThrough()
  var bom = new BOMStorage()
  var root = new BOMPathNode()
  root.type = 'root'
  root.children = {}

  var all_nodes = []
  lsnodes(path, receivedFiles)

  return readonly(output)

  function receivedFiles (err, files) {
    if (err) {
      output.emit('error', err)
      output.end()
      return
    }
    files.forEach(function (file) {
      var n = new BOMPathNode()
      n.name = file.name
      n.mode = file.mode
      n.uid = typeof opts.uid === 'number' ? opts.uid : file.uid
      n.gid = typeof opts.gid === 'number' ? opts.gid : file.gid
      n.size = file.size || 0
      n.checksum = file.checksum || 0
      if (file.linkName) n.linkName = file.linkName
      if ((n.mode & 0xf000) === 0x4000) {
        n.type = 'directory'
      } else if ((n.mode & 0xf000) === 0x8000) {
        n.type = 'file'
      } else if ((n.mode & 0xf000) === 0xa000) {
        n.type = 'symboliclink'
      // TODO: symbolic links
      } else {
        throw new Error('file type not supported')
      }
      all_nodes.push(n)
    })

    // create tree

    var num = all_nodes.length

    all_nodes.forEach(function (node) {
      var path_elements = node.name.split('/')
      path_elements.shift() // ignore . as root
      var parent = root
      path_elements.forEach(function (path_element, i) {
        if (i === path_elements.length - 1) {
          if (!('children' in parent)) parent.children = {}
          parent.children[path_element] = node
        }
        parent = parent.children[path_element]
        if (!parent) throw new Error('Parent dir not found')
      })
    })

    // BomInfo
    var bomInfo = new Buffer(4 * 3 + 1 * 16)
    bomInfo.fill()
    bomInfo.writeUInt32BE(1, 0)
    bomInfo.writeUInt32BE(num + 1, 4) // number of paths
    bomInfo.writeUInt32BE(1, 2 * 4) // number of info entries
    // more needed?
    bom.addVar('BomInfo', bomInfo)

    // 338

    // num_paths = number of blocks
    var num_paths = Math.ceil(num / 256)
    var root_paths = new BOMPaths(num_paths)

    var stack = [{parent: 0, node: root}] // queue
    var j = 0
    var k = 0 // mod 256 blocks
    var current_path = 0
    var last_path_id = 0
    var last_file_info = 0
    var paths = null
    while (stack.length > 0) {
      var elem = stack.shift()
      var arg = elem.node
      var parent = elem.parent
      for (var s in arg.children) {
        var node = arg.children[s]

        // start block
        if (k === 0) {
          var new_paths_id = 0
          if (paths) {
            new_paths_id = bom.addBlock(paths)
            root_paths.setIndex(0, current_path, new_paths_id)
            if (last_path_id > 0) {
              var prev_paths = bom.getBlock(last_path_id)
              prev_paths.forward = new_paths_id
            }
            root_paths.setIndex(1, current_path, last_file_info)
            paths = null
            current_path++
          }
          var next_num = (num - j) > 256 ? 256 : (num - j) // max or last
          paths = new BOMPaths(next_num)
          paths.isLeaf = true
          paths.backward = new_paths_id
          last_path_id = new_paths_id
        }

        // BOMPathInfo1 BOMPathInfo2
        var info = new BOMPathInfo(j + 1)
        info.index = bom.addBlock(node)
        paths.setIndex(0, k, bom.addBlock(info))

        // 406
        // BOMFile
        var f = new BOMFile()
        f.parent = parent
        f.name = s
        last_file_info = bom.addBlock(f)
        paths.setIndex(1, k, last_file_info)

        stack.push({parent: j + 1, node: node})
        j++
        k = (k + 1) % 256
      }
    }

    var tree = new BOMTree(num)

    if (num_paths > 1) {
      var next_block = bom.addBlock(paths)
      bom.getBlock(last_path_id).forward = next_block
      root_paths.setIndex(0, current_path, next_block)
      root_paths.setIndex(1, current_path, last_file_info)
      tree.child = bom.addBlock(root_paths)
    } else {
      tree.child = bom.addBlock(paths)
    }
    bom.addVar('Paths', tree)

    // add empty_path
    var empty_path = new BOMPaths()
    empty_path.isLeaf = true

    tree = new BOMTree(0)
    tree.child = bom.addBlock(empty_path)
    bom.addVar('HLIndex', tree)
    // BOMVindex
    var vindex = new BOMVIndex()

    tree = new BOMTree(0)
    tree.child = bom.addBlock(empty_path)
    tree.blockSize = 128

    vindex.index = bom.addBlock(tree)
    bom.addVar('VIndex', vindex)

    tree = new BOMTree(0)
    tree.child = bom.addBlock(empty_path)
    bom.addVar('Size64', tree)

    bom.createReadStream().pipe(output)
  }
}
