const http = require('http');
const fs = require('fs');
const url = require('url');

const hostname = '127.0.0.1';
const port = 8000;

const server = http.createServer();

server.on('request', (request, response) => {
  console.log(request.url + "       " + request.method);
  const parsedUrl = url.parse(request.url, true);
  const path = parsedUrl.pathname;
  const query = parsedUrl.query;
  if (path === '/') {
    fs.readFile('D:\\bureau\\wallpaper\\ProjectHomeGround\\Skeleton-2.0.4\\index.html\\', (err, data) => {
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.end(data);
    });
  }

});
// 'D:\\bureau\\wallpaper\\ProjectHomeGround\\Skeleton-2.0.4\\index.html\\'
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

