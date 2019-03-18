var path = require('path')
var MuxrpcApi = require('muxrpc/api')
var Run = require('./run')
module.exports = (location, name) => {
  const manifest = require(path.join(location, 'manifest.json'))
  return {
  name: name,
  version: require(path.join(location, 'package.json')).version,
  manifest: manifest,
  init: (server, conf) => {
      const localCall = require('muxrpc/local-api')(server, server.getManifest())
      return MuxrpcApi({}, manifest, Run(location, localCall).remoteCall)
    }
  }
}

