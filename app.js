//importing module
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const port = process.env.PORT || 3000;
//init app
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const url = "mongodb://localhost:27017/testtodo";

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//static folder middleware
app.use(express.static(path.join(__dirname,'public')));

//view setup
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

//create mongodb connection
MongoClient.connect(url, (err,database)=>{
  if(err){
    return console.log(err);
  }
  var db = database;
  todos = db.collection('todos');
  console.log("Mongodb connected...");
})
//inserting documents

//rendering the pages
app.get('/' ,(req,res,next)=>{
  todos.find({}).toArray((err,todos) =>{
    if(err){
      return console.log(err);
    }
    res.render('index', {
      todos: todos
    });
  });
});
//post request
app.post("/todo/add", (req, res, next)=>{
  const todo = {
    text : req.body.text,
    body : req.body.body
  }
  //insert todos
  todos.insert(todo, (err, result)=>{
    if(err){
      return console.log(err);
    }
    console.log('Todo added...');
    res.redirect('/');
  });
});

//delete request
app.delete('/todo/delete/:id',(req,res,next)=>{
  const query = {_id : ObjectID(req.params.id)}
  todos.deleteOne(query, (err,response)=>{
    if(err){
      return console.log(err);
    }
    console.log('todo removed');
    res.send(200);
  })
});
//update todo
app.get('/todo/edit/:id' ,(req,res,next)=>{
  const query = {_id: ObjectID(req.params.id)}
  todos.find(query).next((err,todo) =>{
    if(err){
      return console.log(err);
    }
    res.render('edit', {
      todo: todo
    });
  });
});

app.post("/todo/edit/:id", (req, res, next)=>{
  const query = {_id: ObjectID(req.params.id)}
  const todo = {
    text : req.body.text,
    body : req.body.body
  }
  //update todos
  todos.updateOne(query,{$set: todo}, (err, result)=>{
    if(err){
      return console.log(err);
    }
    console.log('Todo updated...');
    res.redirect('/');
  });
});
//listen to port 3000
app.listen(port,()=>{
  console.log(`port started at ${port}`);
})
