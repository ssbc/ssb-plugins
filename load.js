const {basename} = require('path')

module.exports = (location) => {

  const {child, manifest} = require('./run')(location)

  return {
	name: basename(location), // TODO: pass name from config?!
	version: 'alpha?',
	manifest: manifest,
	init: (sbot, conf) => {
	  // TODO: how do I pass sbot to it without creating a loop?
	  var api = require('muxrpc/api')({}, manifest, child)
	  console.log('load returning',api)
	  return api
	}
  }
}
