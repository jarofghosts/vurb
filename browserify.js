var EE = require('events')

var browserify = require('browserify')
var watchify = require('watchify')
var minimist = require('minimist')
var concat = require('concat-stream')

module.exports = vurbBrowserify

function vurbBrowserify (args) {
  var opts = minimist(args)
  var entry = 'index.js'
  var url = 'bundle.js'
  var ee = new EE()
  var bundled = false
  var bundle = ''

  if (opts.browserify) {
    entry = opts.browserify.split(':')[0]
    url = opts.browserify.split(':')[1]
  }

  var b = browserify({
    entries: [entry],
    plugin: [watchify],
    cache: {},
    packageCache: {}
  })

  b.on('update', rebundle)

  rebundle()

  return function (req, res, next) {
    if (req.url.slice(1) !== url) {
      return next()
    }

    if (bundled) {
      res.writeHead(200, {'content-type': 'text/javascript'})
      res.end(bundle)
    } else {
      ee.once('error', function (err) {
        res.writeHead(500)
        res.end('Error: ' + err.message)
      })

      ee.once('data', function (bundle) {
        res.writeHead(200, {'content-type': 'text/javascript'})
        res.end(bundle)
      })
    }
  }

  function rebundle () {
    bundled = false
    b.bundle()
      .on('error', ee.emit.bind(ee, 'error'))
      .pipe(concat(saveBundle))
  }

  function saveBundle (data) {
    bundled = true
    bundle = data.toString()
    ee.emit('data', bundle)
  }
}
