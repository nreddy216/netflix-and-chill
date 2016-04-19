// //SO FAR ONLY LIKES TO TEST CREATE METHOD
//
// //eventually want to GET movies from OMDB
// //CLICK ON ADD BUTTON next to the movie after searching
// //ADD movie to our User's "LIKES"
//
//
var db = ("../models/");
var User = require("../models/user");
var Like = require("../models/like");
var UserLike = require("../models/userLike");
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/netflixandchill');
console.log("DB IS CONNECTED");

User.remove({}, function(err, users){
  if(err){
      console.log("ERROR: ", err);
      process.exit();
      mongoose.connection.close();
    } else {
      console.log("WORKED");
    }
});

Like.remove({}, function(err, users){
  if(err){
      console.log("ERROR: ", err);
      process.exit();
      mongoose.connection.close();
    } else {
      console.log("WORKED");
      process.exit();
      mongoose.connection.close();
    }
});

//
// var likesList = [
//   {
//     title: "Game of Thrones",
//     imageUrl: "http://ia.media-imdb.com/images/M/MV5BMjM5OTQ1MTY5Nl5BMl5BanBnXkFtZTgwMjM3NzMxODE@._V1_SX300.jpg",
//     plot: "While a civil war brews between several noble families in Westeros, the children of the former rulers of the land attempt to rise up to power. Meanwhile a forgotten race, bent on destruction, return after thousands of years in the North",
//     imdbID: "tt0944947",
//     yearOfRelease: "2011-"
//   },
//
//   {
//     title: "Troll 2",
//     imageUrl: "http://ia.media-imdb.com/images/M/MV5BMTM1OTUzOTM2OV5BMl5BanBnXkFtZTcwMzYxNDY3NA@@._V1_SX300.jpg",
//     plot: "A family vacationing in a small town discovers the entire town is inhabited by goblins in disguise as humans, who plan to eat them",
//     imdbID: "tt0105643",
//     yearOfRelease: "1990"
//   },
//
//   {
//     title: "Broad City",
//     imageUrl: "http://ia.media-imdb.com/images/M/MV5BMTYxNzk5MDA2MF5BMl5BanBnXkFtZTgwNjM2MjQzMTE@._V1_SX300.jpg",
//     plot: "Broad City follows two women throughout their daily lives in New York City, making the smallest and mundane events hysterical and disturbing to watch all at the same time",
//     imdbID: "tt2578560",
//     yearOfRelease: "2014-"
//   }
// ];
//
// var usersList = [
//   {
//     firstName: "Brian",
//     lastName: "Li",
//     gender: "Male",
//     birthday: "02/02/00"
//   },
//
//   {
//     firstName: "Jessie",
//     lastName: "Hong",
//     gender: "Female",
//     birthday: "02/02/00"
//   },
//
//   {
//     firstName: "Nidhi",
//     lastName: "Reddy",
//     gender: "Female",
//     birthday: "02/02/00"
//   }
// ];
//
//
// //Nested Users and Likes - closes connection once both are seeded
// Like.remove({}, function(err, likes){
//   Like.create(likesList, function(err, likes){
//     if(err){
//       console.log("ERROR: ", err);
//     }
//     else{
//       User.remove({}, function(err, users){
//         User.create(usersList, function(err, users){
//           if(err){
//             console.log("ERROR: ", err);
//           }
//           else{
//
//             //Nested for loop to push in all the seed 'likes' _ids
//             //in each user
//             //since it's referenced data, it can only be _id NOT anything else
//             users.forEach(function(user){
//               likes.forEach(function(like){
//                 user.likes.push(like._id);
//                 user.save(likes);
//               });
//               console.log(user.firstName + " likes " + user.likes);
//             });
//
//
//             console.log("all users: ", users);
//             console.log("created ", users.length, " users");
//             process.exit();
//             mongoose.connection.close();
//           }
//
//         });//end of User create
//       });//end of User remove
//     }//end of first else
//   }); //end of Like create
// }); //end of Like remove
