var app=angular.module('loginApp',['ngCookies','ngRoute']);

app.config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
                when('/', {
                    templateUrl: 'login.html',
                    controller : 'loginController'
                }).when('/register',{
                    templateUrl: 'register.html',
                    controller: 'registerController'
                }).when('/home',{
                	templateUrl : 'home.html',
                  controller: 'homeController',
                    resolve:{
                        loggedIn:onlyLoggedIn
                    }
                }).when('/showTodos',{
                  templateUrl: 'TodoList.html',
                controller: 'homeController',
                  resolve:{
                        loggedIn:onlyLoggedIn
                    }
                }).when('/showNotes',{
                  templateUrl:'Notes.html',
                controller: 'homeController',
                  resolve:{
                        loggedIn:onlyLoggedIn
                    }
                }).when('/saveTodoList',{
                  templateUrl: 'TodoList.html',
                  resolve:{
                        loggedIn:onlyLoggedIn
                    }
                }).when('/logout',{
                    templateUrl: 'logout.html',
                    controller: 'logoutConttroller'
                }).otherwise({
                	redirectTo : '/'
                })



        }]);

app.factory('myFactory',function($http,$cookieStore){
  var factory={};
    //factory.user={};
    console.log('inside myFactory');
    console.log(factory.user);
    var loggedIn=false;
    
    factory.isLogin=function(){
        return loggedIn;
    }
    factory.logout=function(){
        loggedIn=false;
    }
    
    factory.checkUser=function(user){
      return $http({
      url: '/checkUser',
      params: user,
      method: 'GET'
    }).then(function(response){
      //console.log('----------------------------------');
          //console.log(response.data);
      if(response.data){
          //factory.user=response.data;
          $cookieStore.put("user", response.data);
          loggedIn=true;
          console.log('cookie value');
         console.log($cookieStore.get("user"));
        //console.log('true');
        return response.data;
      }else{ console.log('got null');}
    },function(){
      console.log('error');
      return false;

    });
  }
    
    console.log('after checkUser is called');
    
    console.log(factory.user);
    /*  $http.get('/checkUser/'+JSON.stringify(user)).success(function(data){
        console.log(data);
        flag=true;
      }).error(function(data){
        console.log(data);
      })*/

      //return flag;
    factory.getTodoList=function(user){
      console.log(user);
      var todolist=[];
      return $http({
        url: '/getTodoList',
        params: user,
        method: 'GET'
      }).then(function(response){
        var ress=JSON.stringify(response.data[0].todo_list)
        console.log('yhh'+ress);
        var lst=JSON.parse(ress);
        lst.forEach(function(a){
        //todolist=todolist.push({todos:a.todos,completed:a.completed});
        todolist=todolist.concat(a);
      });
      //console.log('++++'+todolist);
        return todolist;
      });


    }
    
    factory.getNotesList=function(user){
     console.log(user);
      var noteslst=[];
      return $http({
        url: '/getNotesList',
        params: user,
        method: 'GET'
      }).then(function(response){
        var notes=JSON.stringify(response.data[0].notes_list)
        console.log('yhh'+notes);
        var nlst=JSON.parse(notes);
        nlst.forEach(function(a){
        //todolist=todolist.push({todos:a.todos,completed:a.completed});
        noteslst=noteslst.concat(a);
      });
      //console.log('++++'+todolist);
        return noteslst;
      });
        
    
    }


    factory.submitUser=function(user){
      return $http({
        url: '/submitUser',
        data: JSON.stringify(user),
        method: 'POST'
      }).then(function(response){
        // console.log(response);
        // console.log('----------------------');
        // console.log('success');
      })
    }


    factory.updateTodoList=function(user,todo_list){
      return $http({
        url:'/updateTodoList',
        data:{
          user:JSON.stringify(user),
          todo_list:JSON.stringify(todo_list)
        },
        method:'POST'
      }).then(function(response){
        console.log('response');
        return response;
      })
    }


    factory.addTodo=function(user,newTodo){
      return $http({
        url:'/addNewTodo',
        method: 'POST',
        data:{
          user:JSON.stringify(user),
          newTodo:JSON.stringify(newTodo)
        }
      }).then(function(response){
        console.log(response);
        return response;
      })
    }
    
    
    
    
     factory.addNote=function(user,newNote){
         console.log('addNote factory Method called');
      return $http({
        url:'/addNewNote',
        method: 'POST',
        data:{
          user:JSON.stringify(user),
          newNote:JSON.stringify(newNote)
        }
      }).then(function(response){
        console.log(response);
        return response;
      })
    }

  return factory;

});

app.controller('loginController',function($scope,$location,$http,myFactory){
  //$scope.todoname="Perform Tasks";
  console.log('controller reached');
    console.log(myFactory.isLogin());
  $scope.todo_list=[];
 // var user={username:'abc',userpass:'abc'};
    console.log($scope.user);
  $scope.checkUser=function(){
  user={
      username:$scope.user.username,
      userpass:$scope.user.userpass
  };

  myFactory.checkUser(user).then(function(response){
       // var usr=JSON.stringify(response);
       // console.log(usr);
      if(response){
         $scope.user = response;
         console.log('scope is '+$scope.user); //check why scope is coming [Object object];
         $location.path('/home');
      }
      else{
         console.log('could not log in (controller)');
          $scope.msg="Invalid credentials. Please try again";
            //alert('Invalid'); 
      }
    },function(){
      console.log('could not log in (controller)');
      //alert('Invalid');
    });
      console.log(myFactory.user);
    //console.log('User is now'+$scope.user);
  };
  
});


var onlyLoggedIn = function ($location,$q,myFactory) {
    var deferred = $q.defer();
    if (myFactory.isLogin()) {
        deferred.resolve();
    } else {
        deferred.reject();
        $location.url('/login');
    }
    return deferred.promise;
};

app.controller('homeController',function($scope,$location,$http,$cookieStore,myFactory){
    $scope.showLink=false;
//    console.log('factory instantiated');
//    console.log('controller reached');
//    console.log(myFactory.isLogin());
    
    
    //var usr=myFactory.user;
    var usr=$cookieStore.get("user");
    $scope.user=$cookieStore.get("user");
    $scope.todo_list=[];
    $scope.notes_list=[];
//var usr={username:'abc',userpass:'abc'};
  // $scope.todo_list=
  myFactory.getTodoList(usr).then(function(response){
    console.log('jjkj'+response);
      //alert(response);
    $scope.todo_list=response;
  });
    
    myFactory.getNotesList(usr).then(function(response){
    console.log('jjkj'+response);
      //alert(response);
    $scope.notes_list=response;
  });

  //console.log($scope.todo_list);
  $scope.updateLink=function(){
    $scope.showLink=true;
  }
  
  $scope.getTotalTodos = function () {
  return $scope.todo_list.length;
}
  
  $scope.getTotalNotes=function(){
      return $scope.notes_list.length;
  }
  
  $scope.saveTodoList=function(){
    console.log($scope.todo_list);
    myFactory.updateTodoList(usr,$scope.todo_list).then(function(response){   //passing static user, need to figure out how to maintain a session
  // also, maybe, store the todo list along with the user variable itself, with the username and userpass
      console.log('todo list updated');
        $location.path('/showTodos');
    })
  }

  $scope.addTodo=function(){
    var newTodo=document.getElementById('todoname').value;
    //console.log(tn);
    myFactory.addTodo(usr,newTodo).then(function(response){
      console.log('New Todo Added');
        //alert('Todo successfully added'); //modal dialog
        //$location.path('/showTodos');
        //$scope.$apply();
        window.location.reload();
       
    });
  }
  
  $scope.addNote=function(){
      console.log('addNote controller method called');
    var newNote=document.getElementById('notename').value;
    console.log(newNote);
    myFactory.addNote(usr,newNote).then(function(response){
      console.log('New Note Added');
        //alert('Todo successfully added'); //modal dialog
        //$location.path('/showTodos');
        //$scope.$apply();
        //window.location.reload();
       
    });
  }





});


app.controller('registerController',function($scope,$location,myFactory){
  //console.log('registerController');


  $scope.submitUser=function(){
    var user={
      username:$scope.user.username,
      lastname:$scope.user.lastname,
      userpass:$scope.user.userpass,
      email:$scope.user.email
    }
    if(myFactory.submitUser(user)){
      console.log('user registered successfully');
      $location.path('/home');
    }
    else{
      console.log('could not register');
    }
  }
})

app.controller('logoutController',function($scope,myFactory,$cookieStore){

$scope.user={};
$cookieStore.remove("user");
myFactory.logout();

});