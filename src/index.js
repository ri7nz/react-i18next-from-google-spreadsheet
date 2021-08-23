const loader = require("./loader");
var argv = require("minimist")(process.argv.slice(2));

//arguments from terminal
let foundKey = argv.key;
let foundLocation = argv.location;
let foundRowNumber = argv.firstrow;
let foundApiKey = argv.apiKey;

if (
  (typeof foundKey !== "string" && typeof foundKey !== "number") ||
  foundKey == ""
) {
  console.error("Key is required: --key=... ");
  process.exit(1);
}
if (
  (typeof foundLocation !== "string" && typeof foundLocation !== "number") ||
  foundLocation == ""
) {
  console.error("Location is required: --location=... ");
  process.exit(1);
}
if (typeof foundRowNumber !== "number" || foundRowNumber == "") {
  console.error("First row is required: --firstrow=... ");
  process.exit(1);
}
if (typeof foundApiKey !== "string" || foundApiKey == "") {
  console.error(`GoogleSpreadsheet minimum authorization is ApiKey

see https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication?id=api-key`);
  process.exit(1);
}

const loadOptions = {
  docId: foundKey,
  sheet: 1,
  firstRow: foundRowNumber,
  apiKey: foundApiKey,
  ignoreCommentsColumn: true,
};

const saveOptions = { folderName: foundLocation };

console.info("Loading...");
loader.load(loadOptions, (err, data) => {
  console.info("Loaded!", { data });
  console.info("Saving...");
  if (err) {
    console.error(err);
    process.exit(1);
  }
  //console.log('-', data)
  try {
    loader.save(saveOptions, data);
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    console.log("!Done!");
  }
});
