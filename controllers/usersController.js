const repl = require('repl');

/************
 * DATABASE *
 ************/
// var Like = require('../models/like');
var User = require('../models/user');

function returnError (err) {
  return console.log(err);
}

function renderLandingPage (req, res) {
  // console.log(session.userId);
  res.render('./pages/landing_page', {user: req.user});
}

function getAPI(req, res){
  res.json({
    message: "This is the API for Netflix and Chill",
    documentation_url: "https://github.com/takshingli810/NetlfixAndChill",
    base_url: "http://netflixandchill.herokuapp.com",
    endpoints: [
      {method: "GET", path: "/api", description: "Describes available endpoints"}
    ]
  });
}

//SHOW ALL USERS
function getUsersAPI (req, res){
  User.find(function(err, users){
    if(err){
      console.log("ERROR: ", err);
    }

    res.json({users: users});
  });
}

//NIDHI'S LIKES FUNCTION
// //Click on '+' and add movie to 'Users' 'movies' attribute in API
function addMoviesToUsersAPI(req, res) {
  var imdbID = req.body.imdbID;
  var userID = req.body.userID;

  User.findOne({_id: userID}, function(err, user){
      if(err){
        console.log("ERROR WITH FIND ADD MOVIES", err);
      }
      else{
        console.log("HITTING FIND ONE IN ADD MOVIES ");
        //FIND IF USER IS ALREADY ON ARRAY
        if (user.movies.indexOf(imdbID)=== -1 ){
          console.log("IMDBID: ", imdbID);
          //pushes user onto Like users array
          user.movies.push(imdbID);
          user.save( function(err){
            if(err){
              console.log("ERROR WITH SAVE: ", err);
            }
            else{
              res.status(201);
            }
          });
        };

        console.log("USER ID: ", userID);
      }

    });
};


function showUserAPI(req, res){
  User.findOne({_id: req.params.id}, function(err, user){
    if(err){
      console.log("Show users route not working", err);
    }
    res.json(user);
  })
}

function showUserMoviesAPI(req, res){

  User.findOne({_id: req.params.id}, function(err, user){
    // repl.start('> ').context.id = req.params.id;

    if(err){
      console.log("Show user movies route not working", err);
    }
    else{
      res.json(user.movies);
    }
  })
}


//JESSIE'S USER CRUD FUNCTIONS
//Show profile --- Jessie -- WORKING
function show (req, res) {
  // console.log(req.params.id);
  User.find({_id: req.params.id}, function(err, user) {
   req.currentUser(function(err, currentUser) {
    if (err) {
      console.log("req.session", req.session);
      res.status(500).send();
      console.log("ERROR: ", err);
    } else {
      console.log("req.session", req.session);
      res.render('./pages/profile_show', {currentUser: currentUser, user: user[0]});
    }
   });
  });
}

//edit function--get form to edit user -- Jessie -- WORKING
function edit (req, res) {
  User.find({_id: req.params.id}, function(err, user){

    req.currentUser(function(err, currentUser) {
    if (err) {
      res.status(500).send();
      console.log("ERROR: ", err);
    } else {
      // console.log("req.session", req.session);
      res.render('./pages/edit_profile', {currentUser: currentUser, user: user[0]});
    }
   });
  });
}

//update function -- Jessie -- Working, changes persist
function update (req, res) {
  var id = req.body.userId;
  User.find({_id: id}, function(err, user){
    if (err) {
      res.status(500).send();
      console.log("ERROR: ", err);
    } if (req.body.status) {user.status = req.body.status; }
    if (req.body.firstName) {user.firstName = req.body.firstName; }
    if (req.body.lastName) {user.lastName = req.body.lastName; }
    if (req.body.gender) {user.gender = req.body.gender; }
    if (req.body.location) {user.location = req.body.location; }
    if (req.body.birthday) {user.birthday = req.body.birthday; }
    if (req.body.sexualPref) {user.sexualPref = req.body.sexualPref; }
    var edited_details = {
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      location: user.location,
      birthday: user.birthday,
      sexualPref: user.sexualPref,
      status: user.status
    };
    User.update({_id: id}, edited_details, function(err, user) {
      if (err) {
        console.log("ERROR: ", err);
      } else {
      res.redirect('/users/' + id); //redirects to correct show page URL! DATA IS THERE THANK GOD
      }
    });
  });
}


//Delete a user -- WORKING -- Jessie
//Deletes a user from the database
function destroy (req, res) {
  console.log(req.params.id);
  User.remove({_id: req.params.id}, function(err, users){
    if (err){
      res.status(500).send();
      console.log("ERROR: ", err);
    } else {
      //redirect to logout because you also want to reset the session object w/ user id = to null
      res.redirect("/logout");
    }
  });
}

//Show Matches page -- Jessie

function showMatches (req, res) {
  // console.log(req.params.id);
  User.find({_id: req.params.id}, function(err, user) {
   // repl.start('> ').context.user = user;
   var myLikesArray = user[0].movies;
   req.currentUser(function(err, currentUser) {
    // console.log("this is the current user: ", currentUser.id);
    if (err) {
      res.status(500).send();
      console.log("ERROR: ", err);
    } else {
      //returns an array of users who have at least one like in common with currentUser
        User.find({movies: {$in: myLikesArray}}, function (err, matches) {
          if (err) {
            console.log("ERROR: ", err);
            res.status(400).send();
          }
          var myMatches = [];
          // repl.start('> ').context.matches = matches;
          for (var i = 0; i < matches.length; i ++) {
            //if the match is the current user, don't add them to matches array.
            if (matches[i]._id == currentUser.id) { continue; }
              var myMatch = {};
              myMatch.id = matches[i]._id;
              myMatch.firstName = matches[i].firstName;
              myMatch.lastName= matches[i].lastName;
              myMatch.profilePic = matches[i].profilePic;
              myMatch.location = matches[i].location;
              myMatch.sexualPref = matches[i].sexualPref;
              myMatch.gender = matches[i].gender;
              myMatch.facebookID = matches[i].facebookID;
              //create an array to collect movie titles that you have in common
              myMatch.inCommon = [];

              var matchLikesArray =  matches[i].movies;
              for (var j = 0; j < matchLikesArray.length; j ++) {
                //if myLikesArray has something in common with the matchLikesArray, push it to inCommon.
                if ((myLikesArray.indexOf(matchLikesArray[j])) !== -1) {
                  myMatch.inCommon.push(matchLikesArray[j]);
                }
              }
          //push myMatch to myMatches array.
          myMatches.push(myMatch);
          }
          res.render('./pages/matches', {currentUser: currentUser, user: user[0], myMatches: myMatches});
          console.log("HERE ARE MY MATCHES: ", myMatches);
        });
    //end else statement
    }
  //end currentUser function
  });
//end user.find
  });
}


//DELETE LIKE - push out from 'movies' array
function deleteFromLikesAPI (req, res){
  var imdbID = req.body.imdbID;
  var userID = req.params.id;
  //ensures that there are likes in the users movies
  //if so, destroys the like based on the imdbID
  //else it updates the like with additional users


  console.log("IMDBID " + imdbID + " userID " + userID);

  User.find({_id: userID}, function(err, user){
    if(err){
      console.log("ERROR: ", err);
    }
    else{
      // console.log("USER MOVIES FROM DELETE: ", user[0].movies);
      var indexOfMovie = user[0].movies.indexOf(imdbID);
      user[0].movies.splice(indexOfMovie, 1);
      user[0].save( function(err){
        if(err){
          console.log("ERROR WITH SAVE: ", err);
        }
        else{
          res.status(201);
        }
      });
    }
  });
};


module.exports = {
  renderLandingPage: renderLandingPage,
  getAPI: getAPI,
  getUsersAPI: getUsersAPI,
  show: show,
  destroy: destroy,
  edit: edit,
  update: update,
  addMoviesToUsersAPI: addMoviesToUsersAPI,
  showUserAPI: showUserAPI,
  showUserMoviesAPI: showUserMoviesAPI,
  showMatches: showMatches,
  deleteFromLikesAPI: deleteFromLikesAPI
};
