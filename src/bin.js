const path = require('path')

const parseArgs = require('minimist')
const arrify = require('arrify')

const vurb = require('./')

module.exports = bin

if (require.main === module) {
  bin()
}

function bin () {
  const args = process.argv.slice(2)
  const opts = parseArgs(args)
  const server = vurb(args)
  const plugins = arrify(opts.plugin || [])

  plugins.forEach(plugin => {
    let handler

    try {
      handler = require(plugin)
    } catch (err) {
      handler = require(path.resolve(process.cwd(), plugin))
    }

    server.addHandler(handler)
  })

  server.listen(opts.port || 4058)
}
