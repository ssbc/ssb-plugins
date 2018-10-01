#! /usr/bin/env node

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

var childCall = require('./run')(pluginPath)


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
