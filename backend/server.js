const http = require('http');
const app = require('./app');

app.set('port', process.env.PORT || 3000)
const server = http.createServer(app);

app.use((req, res, next) => {
  res.json({
    message: 'app served'
  });
});

server.listen(process.env.PORT || 3000);
