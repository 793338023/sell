var express = require('express');
var config = require('./config/index');

var port = process.env.PORT || config.build.port;

var app = express();

var router = express.Router();

router.get('/', function(req, res, next) {
  req.url = '/index.html';
  next();
});
app.use(router);
app.use(express.static('./dist'));

/* mockJs--模拟数据获取 */
const data = require('./data.json');
const apiRouter = express.Router();

apiRouter.get('/seller', function (req, res, next) {
  res.send({
    errno: 0,
    data: data.seller
  });
});

apiRouter.get('/goods', function (req, res, next) {
  res.send({errno: 0, data: data.goods});
});

apiRouter.get('/ratings', function (req, res, next) {
  res.send({errno: 0, data: data.ratings});
});

app.use('/app', apiRouter);

/* 监听端口 */
module.exports = app.listen(port, function(err) {
  if (err) {
    console.log(err);
    return false;
  }
  console.log('Listen at http://localhost:' + port + '\n');
});
