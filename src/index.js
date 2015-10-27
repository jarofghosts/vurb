const http = require('http')

const ecstatic = require('ecstatic')

module.exports = vurb

function vurb (args) {
  const server = http.createServer(handler)
  const handlers = [ecstatic(process.cwd())]

  server.addHandler = (fn) => {
    const hnd = fn(args)

    handlers.push(hnd)

    return hnd
  }

  server.removeHandler = (hnd) => handlers.splice(handlers.indexOf(hnd), 1)

  return server

  function handler (req, res) {
    const currentHandlers = handlers.slice()

    callHandler(currentHandlers.shift())

    function callHandler (hnd) {
      if (!hnd) {
        res.writeHead(404)
        res.end('File not found')

        return
      }

      hnd(req, res, () => callHandler(currentHandlers.shift()))
    }
  }
}
