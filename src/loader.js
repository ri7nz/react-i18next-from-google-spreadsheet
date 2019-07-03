const GoogleSpreadsheet = require('google-spreadsheet')
const fs = require('fs')
const folderName = './locales'

// todo: implement google spreadsheet load and processing
// example: https://github.com/mikhail-angelov/gulp-translations-from-spreadsheet/blob/master/index.js

const load = (options, cb) => {
  const my_sheet = new GoogleSpreadsheet(options.docId)
  my_sheet.getInfo(function(err, info) {
    if (err) {
      return cb('invalid google key')
    }

    const sheet = info.worksheets[options.sheet - 1]
    const firstRow = options.firstRow || 1
    const colCount = options.colCount || sheet.colCount
    const rowCount = sheet.rowCount

    my_sheet.getCells(
      options.sheet,
      {
        'min-row': firstRow,
        'max-row': rowCount,
        'min-col': 1,
        'max-col': colCount,
        'return-empty': true,
      },
      function(err, row_data) {
        if (err) {
          return cb(err)
        }
        const converted = {}
        const langs = []
        let commentsColumnIndex

        for (let i = 1; i < colCount; i++) {
          if (options.ignoreCommentsColumn == true && row_data[i].value == 'comments') {
            // do nothing
            commentsColumnIndex = i
          } else {
            if (options.warnOnMissingValues && row_data[i].value.length == 0) {
              console.log('Column is missing key at index ' + i)
            }
            if (options.errorOnMissingValues && row_data[i].value.length == 0) {
              throw new Error('Column is missing key at index ' + i)
            }
            if (row_data[i].value !== undefined) {
              langs[i] = row_data[i].value
            }
          }
        }

        for (let i = firstRow + 1; i <= rowCount; i++) {
          for (let j = 1; j < colCount; j++) {
            if (options.ignoreCommentsColumn && j == commentsColumnIndex) {
              // do nothing
            } else {
              if (options.warnOnMissingValues && row_data[(i - 1) * colCount + j].value.length == 0) {
                console.log('Cell is missing value at col ' + i + ', row ' + j)
              }
              if (options.errorOnMissingValues && row_data[(i - 1) * colCount + j].value.length == 0) {
                throw new Error('Cell is missing value at col ' + i + ', row ' + j)
              }
              let lang = langs[j]

              converted[lang] = converted[lang] || {}

              if (row_data[(i - 1) * colCount + j] === undefined) {
                continue
              }
              if (row_data[(i - 1) * colCount + j].value && row_data[(i - 1) * colCount + j].value !== undefined) {
                converted[lang][row_data[(i - 1) * colCount].value] = row_data[(i - 1) * colCount + j].value
              } else {
              }
            }
          }
        }

        return cb(null, converted)
      }
    )
  })
}

const save = (options, data) => {
  const folderName = options.folderName

  try {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName)
    }
  } catch (error) {
    console.log(`Invalid 'location' parameter: ${folderName}`)
    throw `Invalid 'location' parameter: ${folderName}`
  }

  Object.keys(data).forEach(lang => {
    try {
      fs.existsSync(`${folderName}/${lang}`)
    } catch {
      console.log(`Invalid 'language' name: ${lang}`)
      throw `Invalid 'language' name: ${lang}`
    }
    if (!fs.existsSync(`${folderName}/${lang}`)) {
      try {
        fs.mkdirSync(`${folderName}/${lang}`)
      } catch {
        console.log(`Invalid 'language' name: ${lang}`)
        throw `Invalid 'language' name: ${lang}`
      }
    }
    const content = JSON.stringify(data[lang])
    fs.writeFileSync(`${folderName}/${lang}/translations.json`, content)
  })
}

module.exports = { load, save }
