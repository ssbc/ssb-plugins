#! /usr/bin/env node

var cp = require('child_process')
var MuxRpcStream = require('muxrpc/stream')
var toPull = require('stream-to-pull-stream')
var pull = require('pull-stream')
var path = require('path')
var fs = require('fs')

if (process.argv.length !== 3) {
  console.error(`usage: ${process.argv[1]} pluginPath`)
  process.exit(1)
}

const pluginPath = process.argv[2]
try {
  fs.statSync(pluginPath)
} catch (e) {
  console.error('could not locate specified pluginPath')
  console.warn('exception:', e)
  process.exit(1)
}

const manifestP = path.join(__dirname, pluginPath, 'manifest.json')
let manifest
try {
  manifest = require(manifestP)
} catch (e) {
  console.error('specified plugin has no manifest.json')
  console.warn('exception:', e)
  process.exit(1)
}

function run (path, localCall) {
  var proc = cp.spawn(path, [], {})
  var stream = MuxRpcStream(
    localCall,
    require('packet-stream-codec'),
    function () {}
  )

  pull(
    toPull.source(proc.stdout),
    stream,
    toPull.sink(proc.stdin)
  )

  pull(
    toPull.source(proc.stderr),
    toPull.sink(process.stderr)
  )

  return stream.remoteCall
}

// load and the module in the ./example directory.
var childCall = run(
  path.join(pluginPath, 'bin'),
  // in practice, the localCall method is created
  // from the local api and manifest
  function localCall (type, name, args) {
    console.log('CALLED', type, name, args)
    var cb = args.pop()
    cb(null, { okay: true })
  }
)

var api = require('muxrpc/api')({}, manifest, childCall)

api.callback('bob', function (err, value) {
  if (err) throw err
  console.log(value)
  api.hello('DARRYL', function (err, value) {
    if (err) throw err
    console.log(value)
    process.exit()
  })
})
