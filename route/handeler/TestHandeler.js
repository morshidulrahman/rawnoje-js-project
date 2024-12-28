const handeler = {};

handeler.Testhandeler = (request, callback) => {
  callback(200, {
    message: "Test handeler called successfully",
  });
};

module.exports = handeler;
