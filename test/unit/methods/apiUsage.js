'use strict'

const sinon = require('sinon')
const tap = require('tap')
const test = tap.test
const _ = require('lodash')
const apiUsage = require('../../../lib/methods/apiUsage').apiUsage
const server = require('../../server')

const sandbox = sinon.sandbox

var arrow
var connector
var Model

tap.beforeEach((done) => {
    sandbox.create()
    done()
})

tap.afterEach((done) => {
    sandbox.restore()
    done()
})

test('### Start Arrow ###', (t) => {
    server()
        .then((inst) => {
            arrow = inst
            connector = arrow.getConnector('appc.salesforce.1')
            connector.sdkAPI = {}
            Model = arrow.getModel('Posts')
            t.ok(arrow, 'Arrow has been started')
            t.end()
        })
        .catch((err) => {
            t.threw(err)
        })
})

test('## apiUsage unit test - OK Case ###', function (t) {
    // Stubs and spies
    const cbOkSpy = sandbox.spy()
    connector.sdkAPI.limitInfo = 'test'

    // Execution
    apiUsage.call(connector, cbOkSpy)

    // Tests
    t.ok(cbOkSpy.calledOnce)
    t.equals(cbOkSpy.firstCall.args[0], null)
    t.equals(cbOkSpy.firstCall.args[1], 'test')

    t.end()
})

test('### Stop Arrow ###', (t) => {
    arrow.stop(function () {
        t.pass('Arrow has been stopped!')
        t.end()
    })
})