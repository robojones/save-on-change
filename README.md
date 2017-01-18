# save-on-change

This module allows you to read and write JSON files.
It overwrites the JSON file as soon as you change any value of the object in your Node.js application.
When you are restarting your Node.js app, the object will automatically be loaded from the JSON file.

## Example
```javascript
const autoSave = require('save-on-change')

// load a json file
const a = autoSave('config.json')

// change anything
a.hello = true
a.foo = 'baz'
```
The file `config.json` should now contain:
```json
{"a": true, "foo": "baz"}
```

## Installation
```
npm i save-on-change --save
```

## Function: autoSave(filename[, onSave])
- __filename__ \<String\> filename of the JSON file
- __onSave__ \<Function\> function that gets called every time the object gets saved

__returns__ contents of the file specified by the _filename_

If the JSON file does not exist, an empty object will be returned.
Once you cange anything on the object, the file will be created.
