var cp = require('child_process')
var MuxRpcStream = require('muxrpc/stream')
var createLocalCall = require('muxrpc/local-api')
var toPull = require('stream-to-pull-stream')
var pull = require('pull-stream')
var path = require('path')

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

//load and the module in the ./example directory.
var childCall = run(
  path.join(__dirname, 'example/index.js'),
  //in practice, the localCall method is created
  //from the local api and manifest
  function localCall (type, name, args) {
    console.log("CALLED", type, name, args)
    var cb = args.pop()
    cb(null, {okay: true})
  })

var manifest = require('./example/manifest.json')
var api = require('muxrpc/api')({}, manifest, childCall)

api.callback('bob', function (err, value) {
  if(err) throw err
  console.log(value)
  api.hello('DARRYL', function (err, value) {
    if(err) throw err
    console.log(value)
    process.exit()
  })
})

