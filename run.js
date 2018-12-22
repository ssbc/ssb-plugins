var cp = require('child_process')
var MuxRpcStream = require('muxrpc/stream')
var toPull = require('stream-to-pull-stream')
var pull = require('pull-stream')
var path = require('path')

function run(path, localCall) {
  var proc = cp.spawn(path, [], {})
  var stream = MuxRpcStream(
    localCall,
    require('packet-stream-codec'),
    function onClose() {
      // ??
      proc.kill(9)
    }
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

  return {
    //sream... you mean stream?
    sream: stream.remoteCall,
    proc: proc,
  }
}

// load and run the module
// must have a manifest.json or this will throw
module.exports = (pluginPath, localCall) => {
  const { proc, sream } = run(
    path.join(pluginPath, 'bin'),
    localCall
  )
  return {
    proc: proc,
    child: sream,
    //needed by test/standalone otherwise remove this
    manifest: require(path.join(pluginPath, 'manifest.json'))
  }
}

