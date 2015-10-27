const http = require('http')

const test = require('tape')

const vurb = require('../lib')

test('returns an http server', t => {
  t.true(vurb() instanceof http.Server)
  t.end()
})
