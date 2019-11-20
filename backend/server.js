const http = require('http');

const server = http.createServer((req, res) => {
  res.end('Teamwork backend local server response.');
});

server.listen(process.env.PORT || 3000);
