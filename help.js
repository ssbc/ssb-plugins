
var Module = {
  single: 'module',
  args: {
    module: {
      type: 'string',
      description: 'a module@version-range string'
    }
  }
}

function desc(d, type) {
  return Object.assign({
    description: d,
    type: type
  }, Module)
}

module.exports = {
  description: 'manage ssb plugins',
  commands: {
    install: desc('install a plugin', 'source'),
    uninstall: desc('remove a plugin', 'source'),
    enable: desc('enable an installed plugin, must restart ssb-server afterwards', 'async'),
    disable: desc('disable an installed plugin (without uninstalling), must restart ssb-server afterwards', 'async'),
  }
}














