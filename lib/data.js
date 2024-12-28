const fs = require("fs");
const path = require("path");

// module scaffolding
const lib = {};

// base directory of the data folder
lib.basedir = path.join(__dirname, "/../.data/");

// write data to file
lib.create = (dir, file, data, callback) => {
  // open file for writing
  fs.open(`${lib.basedir + dir}/${file}.json`, "wx", (err, file) => {
    if (!err && file) {
      const stringdata = JSON.stringify(data);

      fs.writeFile(file, stringdata, (err2) => {
        if (!err) {
          fs.close(file, (err3) => {
            callback(err3);
          });
        } else {
          callback(err2);
        }
      });
    } else {
      callback(err);
    }
  });
};

lib.read = (dir, file, callback) => {
  fs.readFile(`${lib.basedir + dir}/${file}.json`, "utf8", (err, data) => {
    callback(err, data);
  });
};

lib.update = (dir, file, data, callback) => {
  // open file for writing
  fs.open(`${lib.basedir + dir}/${file}.json`, "r+", (err, file) => {
    if (!err && file) {
      const stringdata = JSON.stringify(data);

      fs.truncate(file, (err) => {
        if (!err) {
          fs.writeFile(file, stringdata, (err2) => {
            if (!err) {
              fs.close(file, (err3) => {
                callback(err3);
              });
            } else {
              callback(err2);
            }
          });
        } else {
          callback(err);
        }
      });
    } else {
      callback(err);
    }
  });
};

lib.delete = (dir, file, callback) => {
  // Unlink the file
  fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
    if (!err) {
      callback(null, "File successfully deleted.");
    } else {
      callback(err);
    }
  });
};

module.exports = lib;
