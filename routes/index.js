var express = require('express');
var router = express.Router();
const redis = require('redis');

let client = redis.createClient();

//Redis client
client.on('connect', function(){
  console.log("Connected to Redis");
});


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Phlegmer' });
});

router.get('/spittoon',function(req,res,next){
  res.render('spittoon');
})

router.post('/loogiedisplay',function(req,res,next){
  let id = req.body.id;
  client.hgetall(id,function(err,obj){
      if(!obj){
          res.render('index',{
              error: 'event does not exist',
              title: 'NO!'
          });
      }
      else{
          obj.id = id;
          res.render('display',{
              loogie:obj
          });
      }
  })
})

module.exports = router;
