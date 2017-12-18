var express=require('express');
var bodyParser=require('body-parser');
var app=new express();
var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/userdb');
var users=require('./model/users');
var router=express.Router();
app.use(express.static(__dirname + '/scripts'));
 app.use(express.static(__dirname + '/view'));
app.use(express.static(__dirname+'/styles'));


var todo_list=[];
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    //app.use(methodOverride());


app.get('/', function(req, res) {

  res.sendFile(__dirname+'/index.html');
});

app.get('/checkUser',function(req,res,next){
console.log(req.query.username);
console.log('-------------------------------');
  var user_name=req.query.username;
  var user_pass=req.query.userpass;
	console.log(user_name);
// 	users.findOne({name : user_name},function(err, data) {
//   if (err) return console.log('error');
//   console.log('success');
//   console.log(data);
//   res.send(data);
// });

/*users.findOne({username: user_name},function(err, data) {
       if (data){
           console.log(data);
           res.send(data);
       } /*else {
           console.log('no data for the account');
       }
   });*/


   users.findOne({
      $and: [
         {username: user_name}, {password:user_pass}
      ]
   },function(err, data) {
          if (data){
              console.log(data);
              res.send(data);
          }
          else{
            res.send(null);
          }
        });


});

app.get('/getTodoList',function(req,res,next){
  console.log('getTodoList');
  var user_name=req.query.username;
  console.log(user_name);
 users.find({username:user_name},{todo_list : 1, _id:0},function(err,data){
          if(data){
            // console.log(JSON.stringify(data));
             var dt=JSON.stringify(data);
             //console.log(dt);
             res.send(dt);
           }
           else{
             console.log('could not find todos');
          }
 })
// var query = dbSchemas.SomeValue.find({}).select({ "name": 1, "_id": 0});
//
//     query.exec(function (err, data) {
//         if(data){
//           console.log(data);
//           res.send(data);
//         }
//         else{
//           console.log('could not find todos');
//         }
//     });

})

app.get('/getNotesList',function(req,res,next){
  console.log('getNotesList');
  var user_name=req.query.username;
  console.log(user_name);
 users.find({username:user_name},{notes_list : 1, _id:0},function(err,data){
          if(data){
            // console.log(JSON.stringify(data));
             var dt=JSON.stringify(data);
             //console.log(dt);
             res.send(dt);
           }
           else{
             console.log('could not find notes');
          }
 })
// var query = dbSchemas.SomeValue.find({}).select({ "name": 1, "_id": 0});
//
//     query.exec(function (err, data) {
//         if(data){
//           console.log(data);
//           res.send(data);
//         }
//         else{
//           console.log('could not find todos');
//         }
//     });

})

app.post('/submitUser',function(req,res,next){
  console.log('POST Method called');
  console.log('-----------------------');
  console.log(req.body.username);
  var user=new users({username:req.body.username,lastname:req.body.lastname,email:req.body.email,password:req.body.userpass,enabled:true,todo_list:[],notes_list:[]});
  user.save(function (err) {
  if (err) {
		return err;
  }
  else {
  	console.log("User saved");
    //return "success";
  }
});

})

app.post('/updateTodoList',function(req,res,next){
  console.log('updateTodoList');
  var user=JSON.parse(req.body.user);
  var todo_list=JSON.parse(req.body.todo_list);
  console.log(todolst);
  console.log('----------------------');
  var todolst=[];

  todo_list.forEach(function(a){
    todolst.push({todos:a.todos,completed:a.completed});
  })
  console.log(todolst);
  console.log(user.username);
  //var newUser={};
  users.find({username:user.username}, function (err, data) {
      // Handle any possible database errors
      if (err) {
          res.status(500).send(err);
      } else {
          // Update each attribute with any possible attribute that may have been submitted in the body of the request
          // If that attribute isn't in the request body, default back to whatever it was before.
          console.log('user after updating ');
            users.update({username:user.username},{ $set: {todo_list:todolst}}, function(err, data){
              if (err) return res.send(err);
              console.log(data+"succesfully updated");
              return res.send(data);
            });
            console.log('updated');
          // Save the updated document back to the database
          // newUser.save(function (err, data) {
          //     if (err) {
          //         res.status(500).send(err)
          //     }
          //     console.log(data)
          //     res.send(data);
          // });

        }
  });


//   users.update({username:user.username},{todo_list:todolst}, function(err, data){
//     if (err) return res.send(500, { error: err });
//     console.log(data+"succesfully updated");
//     return res.send(data);
// });

});

//add new todo_list
app.post('/addNewTodo',function(req,res,next){
  console.log('addNewTodo');
  var user=JSON.parse(req.body.user);
  var newTodo=JSON.parse(req.body.newTodo);
  users.find({username:user.username}, function (err, data) {
      // Handle any possible database errors
      if (err) {
          res.status(500).send(err);
      } else {
          console.log('Adding a new todo for the said user');
          users.update({username:user.username},{$push:{todo_list:{todos:newTodo,completed:false}}}, function(err, data){
            if (err) return res.send(err);
            console.log(data+"succesfully added");
            return res.send(data);
          });




      }
    })

});

app.post('/addNewNote',function(req,res,next){
  console.log('addNewNote');
  var user=JSON.parse(req.body.user);
  var newNote=JSON.parse(req.body.newNote);
  users.find({username:user.username}, function (err, data) {
      // Handle any possible database errors
      if (err) {
          res.status(500).send(err);
      } else {
          console.log('Adding a new note for the said user');
          users.update({username:user.username},{$push:{notes_list:{note:newNote}}}, function(err, data){
            if (err) return res.send(err);
            console.log(data+"succesfully added");
            return res.send(data);
          });




      }
    })

});






app.listen(8300);
    console.log("App listening on port 8300");
