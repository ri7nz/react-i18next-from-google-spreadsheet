const expect = require('chai').expect

describe('react-i18next-from-google-spreadsheet', () => {
  const loader = require('../src/loader')
  
  after(() => {})

  it('should load google spreadsheet and generate files', async () => {
    const result = await loader.load({})
    expect(result).eql(null)
  })
})