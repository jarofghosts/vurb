var path = require('path')

var minimist = require('minimist')
var sass = require('node-sass')

module.exports = vurbSass

function vurbSass (args) {
  var opts = sassArgs(minimist(args))

  return function (req, res, next) {
    if (req.url.slice(-4) !== '.css') {
      return next()
    }

    var file = path.join(process.cwd(), req.url.slice(1))
      .replace(/\.css$/, '.scss')

    sass.render({
      file: file,
      includePaths: opts['include-paths'] || [],
      outputStyle: opts['output-style'] || 'compressed'
    }, function (err, data) {
      if (err) {
        res.writeHead(500)
        res.end('Error: ' + err.message)

        return
      }

      res.writeHead(200, {'content-type': 'text/plain'})
      res.end(data.css.toString())
    })
  }
}

function sassArgs (opts) {
  return Object.keys(opts).reduce(function (o, k) {
    if (k.indexOf('sass-') === 0) {
      o[k.slice(5)] = opts[k]
    }

    return o
  }, {})
}
