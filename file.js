const fs = require('fs');

// console.log(__dirname);
// console.log(__filename);

fs.appendFile('log.txt', '\n test', console.log)

console.log(fs.readFileSync('log.txt').toString());

