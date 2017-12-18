var mongoose=require('mongoose');

//var Schema = mongoose.Schema;
//mongoose.connect('mongodb://localhost/test');

var TodoSchema=new mongoose.Schema({
  todos: String,
  completed: Boolean
})

var UserSchema = new mongoose.Schema({
  username:String,
  lastname:String,
  email:String,
  password:String,
  enabled:Boolean,
  todo_list:{todos: String,
  completed:{type: String}},
  notes_list:Array
});


var users = mongoose.model('users', UserSchema);

module.exports = users;
