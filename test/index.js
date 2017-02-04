const assert = require('assert')
const fs = require('fs')
const functs = require('functs')

const FILE = 'example.json'

describe('autoSave(filename[, onSave])', function () {

  beforeEach(function () {
    this.autoSave = require('./../index')
  })

  afterEach(function (cb) {
    delete require.cache[require.resolve('./../index')]

    fs.unlink(FILE, (err) => {
      if(err && err.code !== 'ENOENT') {
        cb(err)
      } else {
        cb()
      }
    })
  })

  describe('default', function () {
    it('should return the same proxy if a file is use multiple times', function () {
      const a = this.autoSave(FILE)
      const b = this.autoSave(FILE)

      assert.strictEqual(a, b)
    })

    it('should return the same proxy for the same sub-object', function () {
      const a = this.autoSave(FILE)
      a.b = {}

      assert.strictEqual(a.b, a.b)
    })

    it('should return another proxy if the object gets overwritten', function () {
      const a = this.autoSave(FILE)
      a.b = {}
      const c = a.b
      a.b = {}
      const d = a.b

      assert.notStrictEqual(c, d)
    })
  })

  describe('with onSave', function () {

    beforeEach(function () {
      this.onSave = functs()
      this.obj = this.autoSave(FILE, this.onSave)
    })

    it('should call the onSave function when the object is saved', function (cb) {
      this.onSave.add(() => {
        const json = fs.readFileSync(FILE)

        assert.deepEqual(this.obj, JSON.parse(json))
        cb()
      })

      this.obj.hallo = 'asdf'
    })
  })

  describe('without onSave', function () {

    beforeEach(function () {
      this.obj = this.autoSave(FILE)
    })

    it('should save until the next tick', function (cb) {
      this.obj.hallo = 'foo'

      setImmediate(() => {

        const json = fs.readFileSync(FILE)

        assert.deepEqual(this.obj, JSON.parse(json))
        cb()
      })
    })
  })
})
