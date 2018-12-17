const SecretStack = require('secret-stack')

const test = require('tape')
const { join } = require('path')


test('load: secret-stack style', (t) => {
    // for the stack
    const ak = require('crypto').randomBytes(32).toString('base64')
    let opt = {appKey: ak}

    // load our plugin
    const plugPath = join(process.cwd(), 'example')
    let plug = require('../load')(plugPath)

    // hand it to the stack and init
    let stack = SecretStack(opt).use(plug)
    let bot = stack(opt)

    for (const fn of ['hello', 'callback', 'crash', 'goodbye']) {
        t.true(bot[fn], `has function ${fn}`)
    }

    bot.hello('alice', (err, greet) => {
        t.error(err)
        t.equal(greet, 'hello alice')
        bot.goodbye((err, val) => {
            t.error(err)
            t.equal(val, 'done')
            bot.close(()=>{
                t.end()
            })
        })
    })
})