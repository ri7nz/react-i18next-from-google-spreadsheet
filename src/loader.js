const GoogleSpreadsheet = require("google-spreadsheet").GoogleSpreadsheet;
const fs = require("fs");
const TRANSLATION_FILE = "translation.json";
/**
 * This is only work when  your table like this
 * ```markdown
 * | key | langCode1 | langCode2
 * | x   | x1        | x2
 * ```
 */
const load = (options, cb) => {
  const my_sheet = new GoogleSpreadsheet(options.docId);
  if (options.apiKey) {
    console.info("Authorization use ApiKey");
    my_sheet.useApiKey(options.apiKey).then(() => {
      my_sheet.loadInfo().then(() => {
        const sheet = my_sheet.sheetsByIndex[options.sheet - 1];
        sheet.getRows().then((rows) => {
          let data = rows.reduce((_converted, row) => {
            // console.log({
            //   row,
            //   keys: Object.keys(row),
            //   headerValues: row._sheet.headerValues,
            // });
            const [_key, ...headers] = row._sheet.headerValues || [];
            if (headers.length <= 0) {
              return cb("empty language code in header of your spreadsheet");
            }
            let key = row[_key];
            headers.forEach((lang) => {
              if (_converted.hasOwnProperty(lang)) {
                _converted[lang][key] = row[lang];
              } else {
                _converted[lang] = { [key]: row[lang] };
              }
            });
            return _converted;
          }, {});
          cb(null, data);
        });
      });
    });
  }
};

const save = (options, data) => {
  const folderName = options.folderName;

  try {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
    }
  } catch (e) {
    console.log(`Invalid 'location' parameter: ${folderName}`);
    throw `Invalid 'location' parameter: ${folderName}`;
  }

  Object.keys(data).forEach((lang) => {
    try {
      fs.existsSync(`${folderName}/${lang}`);
    } catch (e) {
      console.log(`Invalid 'language' name: ${lang}`, e);
      throw `Invalid 'language' name: ${lang}`;
    }
    if (!fs.existsSync(`${folderName}/${lang}`)) {
      try {
        fs.mkdirSync(`${folderName}/${lang}`);
      } catch (e) {
        console.log(`Invalid 'language' name: ${lang}`, e);
        throw `Invalid 'language' name: ${lang}`;
      }
    }
    const content = JSON.stringify(data[lang], null, "\t");
    fs.writeFileSync(`${folderName}/${lang}/${TRANSLATION_FILE}`, content);
  });
};

module.exports = { load, save };
