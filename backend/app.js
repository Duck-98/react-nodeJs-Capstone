const http = require("http");

http.createServer((req, res) => {
  console.log(req.url, req.method);
  res.end("Hello node");
});

http.listen(3065);
