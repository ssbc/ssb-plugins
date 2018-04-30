#! /usr/bin/env node

var rpc = require('../wrapper')({
  hello: function (name, cb) {
    console.error('HELLLLOOO', name)
    cb(null, 'hello '+name)
  },
  callback: function (value, cb) {
    console.error('CALLBACK', value, cb)
    rpc('async', 'callback', [value], cb)
  }
},
//our manifest is needed, because the
//calls have a type that must match what we actually
//understand.
require('./manifest'))



