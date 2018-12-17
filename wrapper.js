var MuxRpcStream = require('muxrpc/stream')
var createLocalCall = require('muxrpc/local-api')
var toPull = require('stream-to-pull-stream')
var pull = require('pull-stream')

module.exports = function (api, manifest) {
  var stream = MuxRpcStream(
    createLocalCall(api, manifest, {}),
    require('packet-stream-codec'),
    function onClose(err) {
      if (err) {
        throw err
      } else {
        console.warn('muxrpc plugin wrapper closed')
      }
    }
  )

  pull(
    toPull.source(process.stdin),
    stream,
    toPull.sink(process.stdout)
  )

  return stream
}
