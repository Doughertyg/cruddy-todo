const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////
exports.create = (text, callback) => {
  counter.getNextUniqueId((err, data) => {
    var id = data;
    // create write function which accept text as a parameter and 
    // we use unique id as a name of the file
    // var filePath = exports.dataDir + '/' + id + '.txt'; 
    var filePath = path.join(exports.dataDir, id + '.txt'); 
    console.log(filePath);
    fs.writeFile(filePath, text, (err) => {
      if (err) {
        throw ('error writing counter');
      } else {
        items[id] = text;
        callback(err, { id, text});
      }
    });
  });
};

exports.readAll = (callback) => {
  // go to directory 
  // we need to have the path for each file
  var dirPath = path.join(exports.dataDir); 
  // if the read file function returns an err we'll return an empty array
  fs.readdir ( dirPath, (err, fileList) => { 
    if (err) {
      callback(null, []);
    } else {
      var result = [];
      _.map (fileList, (file) => {
        var splitFile = file.split('.');
        var fileObj = {
          id: splitFile[0],
          text: splitFile[0]
        };
        return result.push(fileObj);
      });
      callback (null, result);// what is returning exactly?
    }
  });
};

exports.readOne = (id, callback) => {
  // define the path
  // concatenate the id to the path adding .txt
  // run fs readFile passing that path
  // callback for the above function
var pathFile = path.join(exports.dataDir,`${id}.txt`);
  fs.readFile (pathFile,'UTF-8', (err, data) => {
    if (err){
      callback (new Error(`no item with id: ${id}`));
    } else {
      var obj = {id: id, text: data};
      callback (null, obj);
    }
  });
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
