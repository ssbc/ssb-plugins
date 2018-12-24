const test = require('tape')
const { join } = require('path')

function fakeLocalCall(type, name, args) {
  console.error('CALLED', type, name, args)
  var cb = args.pop()
  cb(null, { okay: true })
}

test('standalone: kill from host', (t) => {
    const plugPath = join(process.cwd(), 'example')

    var { proc, child, manifest } = require('../run')(plugPath, fakeLocalCall)
    var api = require('muxrpc/api')({}, manifest, child)

    api.callback('bob', (err, value) => {
        t.error(err, 'callback err')
        t.deepEqual(value, { okay: true })
        api.hello('DARRYL', (err, value) => {
            t.error(err, 'hello err')
            t.equal(value, 'hello DARRYL')
            proc.kill()
            t.end()
        })
    })
})

test('standalone: let child crash', (t) => {
    const plugPath = join(process.cwd(), 'example')

    var { child, manifest } = require('../run')(plugPath, fakeLocalCall)
    var api = require('muxrpc/api')({}, manifest, child)

    api.callback('bob', (err, value) => {
        t.error(err, 'callback err')
        t.deepEqual(value, { okay: true })
        api.crash((err) => {
            t.true(err)
            t.equal(err.message, 'unexpected end of parent stream')
            t.end()
        })
    })
})

test('standalone: goodbye', (t) => {
    const plugPath = join(process.cwd(), 'example')

    var { child, manifest } = require('../run')(plugPath, fakeLocalCall)
    var api = require('muxrpc/api')({}, manifest, child)

    api.callback('bob', (err, value) => {
        t.error(err, 'callback err')
        t.deepEqual(value, { okay: true })
        api.goodbye((err, done) => {
            t.error(err, 'goodbye worked')
            t.equal(done,'done')
            t.end()
        })
    })
})

