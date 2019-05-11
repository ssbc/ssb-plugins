# ssb-plugins

proof of concept muxrpc plugins as separate process

# examples

```
var createSbot = require('secret-stack')()
.use(require('ssb-db'))

createSbot
//provides install, uninstall, enable, disable. (optional)
.use(require('ssb-plugins'))
//load the user plugins. (this can be used without the above)
.use(require('ssb-plugins/load-user-plugins')()) //load the actual plugins. This may be used without the above!
//load an out of process plugin directly.
.use(require('ssb-plugins/load')(path, name))
```

## License

MIT




