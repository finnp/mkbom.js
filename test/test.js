var mkbom = require('../')
var concat = require('concat-stream')
var path = require('path')
var lsbom = require('lsbom')
var test = require('tape')

test('equal to reference file', function (t) {
  mkbom(path.join(__dirname, 'testdir'), {uid: 0, gid: 80})
    .pipe(concat(function (bom) {
      var files = lsbom(bom)
      t.equals(files.length, 10, 'number of files')
      t.equals(files.map(function (a) { return a.user }).join(''), '0000000000', 'all users 0')
      t.equals(files.map(function (a) { return a.group }).join(''), '80808080808080808080', 'all groups 80')
      var map = {}
      files.forEach(function (file) {
        map[file.filename] = file
      })
      t.equals(map['.'].mode.toString(8).slice(0, 2), '40', 'type of mode of parent')
      t.equals(map['./one/beta/cats.txt'].mode.toString(8).slice(0, 3), '100', 'file mode of cats.txt')
      t.equals(map['./faust.txt'].size, 258, 'size of faust.txt')
      t.equals(map['./two/past.txt'].checksum, 3136442595, 'checksum of past.txt')
      t.notOk('size' in map['./one'], 'dir one has no size')
      t.notOk('checksum' in map['./one/alpha'], 'dir one has no checksum')
      t.equals(map['./link.txt'].linkname, 'faust.txt', 'correct link name')
      t.equals(map['./link.txt'].size, 9, 'correct link size')
      t.end()
    }))
})
