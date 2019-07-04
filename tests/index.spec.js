const expect = require('chai').expect
const fs = require('fs')

describe('react-i18next-from-google-spreadsheet', function() {
  this.timeout(50000)
  const loader = require('../src/loader')

  after(() => {})

  it('should load google spreadsheet and parse it', done => {
    loader.load(
      { docId: '1cKTLZCglRJkJR_7NGL6vPn1MHdadcLPUOMYjqVKFlB4', sheet: 1, colCount: 5, ignoreCommentsColumn: true },
      (error, data) => {
        expect(error).eql(null)
        expect(data).eql({
          en: { hi: 'Hello', bye: 'Goodbye' },
          ru: { hi: 'привет', bye: 'пока' },
          fi: { hi: 'yo', bye: 'oy' },
        })
        done()
      }
    )
  })
  it('Invalid docId', done => {
    loader.load(
      { docId: '11cKTLZCglRJkJR_7NGL6vPn1MHdadcLPUOMYjqVKFlB4', sheet: 1, colCount: 5, ignoreCommentsColumn: true },
      error => {
        expect(error).eql('invalid google key')
        done()
      }
    )
  })
  it('Invalid location', () => {
    expect(() => loader.save({ folderName: '' }, { test: 'test' })).to.throw("Invalid 'location' parameter: ")
  })
  it(`Invalid 'language' name: too long`, () => {
    expect(() =>
      loader.save(
        { folderName: '123' },
        {
          aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaassaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1231231231231232132123123212321232123212321232123121231231321231231212312312132123132131313212313213213213213213213213213213213213213212313213213213212313212313131213213212313213213213132123123131223132123123112312313213213213213213213213213213213213213213212313:
            'test',
        }
      )
    ).to.throw(
      "Invalid 'language' name: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaassaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1231231231231232132123123212321232123212321232123121231231321231231212312312132123132131313212313213213213213213213213213213213213213212313213213213212313212313131213213212313213213213132123123131223132123123112312313213213213213213213213213213213213213213212313"
    )
    fs.rmdirSync('123')
  })
})
