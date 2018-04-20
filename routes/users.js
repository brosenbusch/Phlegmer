var express = require('express');
var router = express.Router();
const redis = require('redis');

let client = redis.createClient();

//Redis client
client.on('connect', function(){
  console.log("Connected to Redis");
});

router.post('/myprofile',function(req,res,next){
  let loogieID = "loogie"+req.body.id;
  let content = req.body.content;

  client.HMSET(loogieID, ['content',content],function(err,reply){
    if(err){
      console.log(err);
    }
    else{
      console.log(reply);
      res.redirect('/')
    }
  });
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
});

router.delete('/delete/:id', function(req,res,next){
  client.del(req.params.id);
  res.redirect('/')
});

router.get('/all',function(req, res, next){
    client.keys('loogie*', function(err, data){
        if(err){
            console.log(err);
        }
        else{
            let loogielist = {};

            for(let d=0; d<data.length; d++){
                let item = "loogielist"+d;
                loogielist[item] = data[d];
            }
            res.render('spittoon', loogielist);
            console.log(data);
            console.log(loogielist);
        }
    });
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//prefaced by /user/routename

router.get('/myprofile',function(req,res,next){
  res.render('myprofile');
});

router.get('/myfollowers',function(req,res,next){
  res.render('myfollowers');
});

module.exports = router;
