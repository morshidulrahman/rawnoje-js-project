const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
  callback(404, {
    message: "Api was not found!",
  });
};

module.exports = handler;
