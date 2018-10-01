module.exports = (location) => {
  const {child, manifest} = require('./run')(location)
  return {
	// caller has to set name
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
