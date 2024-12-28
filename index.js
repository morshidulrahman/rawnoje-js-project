const http = require("http");

const { handlerequest } = require("./helpers/handelerreq");
// initialize app object
const app = {};

app.config = {
  port: 3000,
};

 

app.createServer = () => {
  const server = http.createServer(app.handlerequest);

  server.listen(app.config.port, () => {
    console.log(`Server is running on port ${app.config.port}`);
  });
};

//handle request
app.handlerequest = handlerequest;

app.createServer();
