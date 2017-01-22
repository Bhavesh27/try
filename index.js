var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var methodoverride = require('method-override');
var _ = require('lodash');

var app = express();

app.use(bodyparser.urlencoded({encoded:true}));
app.use(bodyparser.json());
app.use(methodoverride('X-HTTP-Method-Override'));

app.use(function(req,res,next){
      res.header('Access-Control-Allow-Origin','*');
      res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
      res.header('Access-Control-Allow-Headers','Content-Type');
      next();
});

app.use('/hello',function(req,res,next){
      res.send('This is Home');
      next();
});

mongoose.connect('mongodb://localhost/meanapp');
mongoose.connection.once('open',function(){

      app.models = require('./models/index.js');

      var routes = require('./routes');

      _.each(routes,function(controller,route){
        app.use(route,controller(app,route));
      });

      console.log('Listening on port 3000');
      app.listen(3000);
});
