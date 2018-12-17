const SecretStack = require('secret-stack')

const test = require('tape')
const { join } = require('path')

// for the stack
const ak = require('crypto').randomBytes(32).toString('base64')
let opt = { appKey: ak }

test('load: secret-stack style', (t) => {

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
            bot.close(() => {
                t.end()
            })
        })
    })
})

test('load#2 - trigger callhost', (t) => {
    const plugPath = join(process.cwd(), 'example')
    let plug = require('../load')(plugPath)

    let stack = SecretStack(opt).use(plug)
    let bot = stack(opt)

    bot.callhost((err, ret) => {
        t.error(err)
        var addr = bot.getAddress()
        t.comment('got addr:'+addr)
        t.deepEqual(ret, addr)
        bot.goodbye((err, val) => {
            t.error(err)
            t.equal(val, 'done')
            bot.close(() => {
                t.end()
            })
        })
    })
})