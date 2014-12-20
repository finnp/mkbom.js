# mkbom
Windows | Linux
------- | ---------
[![Windows Build status](http://img.shields.io/appveyor/ci/finnp/mkbom.js.svg)](https://ci.appveyor.com/project/finnp/mkbom.js/branch/master) | [![Build Status](https://travis-ci.org/finnp/mkbom-js.svg?branch=master)](https://travis-ci.org/finnp/mkbom-js)

JavaScript implementation of the Mac OSX cli `mkbom` for creating Installers.

Install with `npm install mkbom`.

Implementation adopted from the Open Source C++ work by @hoghliux: https://github.com/hogliux/bomutils

It's a first working and likely to have bugs. Tests currently only work on my machine
because it compares files to a reference implementation with my local uid/gid/permissions.

## usage

```js
var mkbom = require('mkbom')
var fs = require('fs')

mkbom('./my/folder', function (stream) {
  stream.pipe(fs.createWriteStream('./build/Bom'))
})
```
  

## Command line interface

Install with `npm install mkbom -g` or `npm link`

```
usage: mkbomjs <path> [bomfile]
```

