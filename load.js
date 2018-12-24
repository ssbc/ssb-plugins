var path = require('path')
module.exports = (location, name) => {
  const manifest = require(path.join(location, 'manifest.json'))
  return {
  name: name,
  version: 'alpha?',
  manifest: manifest,
  init: (server, conf) => {
      const localCall = require('muxrpc/local-api')(server, server.getManifest())
      //prefer not to start child process intil plugin is initialized
      //otherwise this would fail when testing multiple sbot instances.
      const {child} = require('./run')(location, localCall)
      // TODO: how do I pass server to it without creating a loop?
      return require('muxrpc/api')({}, manifest, child)
    }
  }
}

