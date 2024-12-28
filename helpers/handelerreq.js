const url = require("url");
const { StringDecoder } = require("string_decoder");
const routes = require("../route");

const { notFoundHandler } = require("../route/handeler/notFoundHandeler");
const { parseJson } = require("./utils");
const handler = {};

handler.handlerequest = (req, res) => {
  const parseUrl = url.parse(req.url, true);
  const path = parseUrl.pathname;
  const trimpath = path.replace(/^\/+|\/+$/g, "");
  const method = req.method.toLowerCase();
  const parseQuery = parseUrl.query;
  const headerobject = req.headers;

  const requestProperties = {
    parseUrl,
    trimpath,
    method,
    parseQuery,
    headerobject,
  };

  const decoder = new StringDecoder("utf-8");
  let realdata = "";

  const choosehandeler = routes[trimpath] ? routes[trimpath] : notFoundHandler;

  req.on("data", (buffer) => {
    realdata += decoder.write(buffer);
  });

  req.on("end", () => {
    realdata += decoder.end();

    requestProperties.body = parseJson(realdata);

    choosehandeler(requestProperties, (statusCode, payload) => {
      statusCode = typeof statusCode === "number" ? statusCode : 500;
      payload = typeof payload === "object" ? payload : {};

      const payloadString = JSON.stringify(payload);

      // return the final response
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);
    });
  });
};

module.exports = handler;
