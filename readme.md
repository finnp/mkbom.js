# mkbom

JavaScript implementation of the Mac OSX cli `mkbom` for creating Installers.

Implementation adopted from the Open Source C++ work by @hoghliux: https://github.com/hogliux/bomutils

It's a first working and likely to have bugs.

## usage

```js
var mkbom = require('mkbom')
var fs = require('fs')

mkbom('./my/folder', function (stream) {
  stream.pipe(fs.createWriteStream('./build/Bom'))
})
```
  

## Command line interface

Install with `npm install mkbom -g`

```
mkbom [path] [bomfile]
```

