const path = require('path');
const express = require('express');
const url = require('url');
const request = require('request');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
var favicon = require('serve-favicon')

const hostname = '127.0.0.1';
const port = 8000;
const app = express();
const router = express.Router();
app.use(favicon(path.join(__dirname, 'public' ,'/favicon.gif')))
console.log(path.join(__dirname, 'public', 'favicon.ico'));
app.use('/scripts', express.static(path.join(__dirname + '/scripts')));
app.use('/images', express.static(path.join(__dirname +'/images')));
app.use('/css', express.static(path.join(__dirname +'/css')));
app.use('/public', express.static(path.join(__dirname + '/public')));

// Setup essential routes
router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '\\..\\index.html'));

});
router.get('/get-page-title',function(req, res) {
  const pageURL = req.query.url;
  const userAgent = req.query.userAgent;
  if(pageURL !== undefined && userAgent !== undefined){
    try {
      request.get({
        url: pageURL,
        headers: {
          'User-Agent' : userAgent
        }
      },(error, response, body)=>{
        // console.log(body);
        if (!error) {
          //console.log(response);
          const dom = new JSDOM(body);
          res.status(200).send(dom.window.document.querySelector('title').textContent);
        } else{
          console.log(error);
        }
      });
    } catch (e){
      console.log(e);
    }
  } else{
    res.status(204);
  }
  console.log(pageURL + "   " + userAgent);
});

// router.get('/favicon.ico', function(req,res){
//   res.sendFile();
// })
// 'D:\\bureau\\wallpaper\\ProjectHomeGround\\Skeleton-2.0.4\\index.html\\'
//add the router
app.use('/', router);
app.listen(8000);
console.log('Running at Port 8000');

