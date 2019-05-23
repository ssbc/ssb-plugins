# ssb-plugins

proof of concept muxrpc plugins as separate process

[see `secret-stack/PLUGINS.md` for how to create a plugin](https://github.com/ssbc/secret-stack/blob/master/PLUGINS.md)

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

## out of process plugins

Run a plugin as a separate process. The process is
started by the parent process, and they communicate
by running muxrpc over stdio. This means that plugins
may now be written in a language other than javascript.

out of process plugins can be loaded manually.
using require('ssb-plugins/load')(location, name)`

``` js
var Load = require('ssb-plugins/load')
createSbot
  .use(Load(path/to/plugin, 'plugin'))
```

## load user configured plugins.

add all plugins defined in configuration.
``` js
createSbot
  .use(require('ssb-plugins/load-user-plugins'))
```

plugins are configured as following:
normally this is created by `sbot plugins.install <plugin-name>`
but it can also be installed manually.

```
  "plugins": {
    //load a javascript plugin, exposed as "plugin1"
    "ssb-plugin1: true,
    //load your own version of plugin2. note it is renamed to "plugin2"
    //so it is exposed as "plugin2" not "plugin2-forked"
    "ssb-plugin2-forked: "plugin2",
    "ssb-plugin2": {
      enabled: true,
      name, process
    }
  }
```

## installing a ssb-plugin manually.

```
cd ~/.ssb
npm install <plugin-name>
# open `./config` in your favorite editor
nano config
# set the config
"plugins": {
  "<plugin-name>": true
}
# or if it's an out of process plugin
"plugins": {
  "<plugin-name>": {
    "process": true,
    "name": ... //if it should be exposed with a different name...
  }
} 
```

## License

MIT


