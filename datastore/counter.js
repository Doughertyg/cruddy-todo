const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (callback) => {
  // initialize the data and read the value of counter from hard drive
  // step1 -  call the read counter function with the CB that returns the data
  // might need another parameter 
  readCounter ((err, data) => {
    var newId = data + 1;
    writeCounter (newId, (err, data) => {
      callback (null, data)
    });
  });
  // step2 - once we are able to read the file (previousley saved counter), 
  // use that to assign to the counter variable
  // we can increment the counter and write it back to the drive on non variable storage
};

// Configuration -- DO NOT MODIFY //////////////////////////////////////////////
exports.counterFile = path.join(__dirname, 'counter.txt');
