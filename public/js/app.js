//CLIENT-SIDE JS
//MAIN FUNCTION

$(function() {
    console.log( "ready!" );

    $("#signup-button").click(function(){
        // $("#signUpModal").modal();
        console.log("no issues with jquery");
    });

    var userID;
    //from the hidden input type in profile_show
    var userID = $('#user-id').attr("user-id");

    if(userID !== undefined){
      //render all likes when they go to their profile
      renderLikes();
      //makes AJAX call to OMDB API and displays top ten movies w/keyword in title
      getMovies();
    }

    //each time the delete button is clicked, it will hide the div of the movie
    $('.delete-btn').on('click', function(){
      $(this).parent('div').hide( "drop", { direction: "down" }, "slow" );
    });

    $('.add-movie-btn').on('click', function(){
      $(this).parent('div').hide( "drop", { direction: "down" }, "slow" );
    });

});


//UPDATE USER'S MOVIES ARRAY TO DELETE THE imdbID
function deleteLike(event){

  //from the hidden input type in profile_show
  var userID = $('#user-id').attr("user-id");
  var imdbID = event.target.id;

  console.log(imdbID);

  var currentLike = {
    imdbID: imdbID,
    userID: userID  //will use req.body.userID to push into users array
  };

  //posting to backend (can view on API LIKES)
  $.ajax({
    type: 'PUT',
    url: '/api/users/' + userID + '/movies',
    data: currentLike,
    dataType: 'json',
    success: function(){
      $('#' + imdbID).hide();
      $('#' + imdbID).attr('type', 'hidden');
      console.log("REMOVING A MOVIE FROM USERS");
    },
    error: function(err) {
      console.log("issue with deleting movie: " + err);
    }
  });

  renderLikes();

}

//show all likes in the MY LIKES div
function renderLikes(){

  //empty out My Likes before rendering
  $('.movies-grid').empty();

  //from the hidden input type in my_profile
  var userID = $('#user-id').attr("user-id");

  //posting to backend (can view on API LIKES)
  $.ajax({
    type: 'GET',
    url: '/api/users/' + userID + '/movies',
    dataType: 'json',
    success: function(usersMovies){
      //movie id is same as imdbID in users movies array
      usersMovies.forEach(function(movieID){
        //ajax request to GET the movie with the imdbID of the movie
        $.ajax({
          type: 'GET',
          url: "http://www.omdbapi.com/?i=" + movieID,
          dataType: 'json',
          success: function(result){
            console.log(result);
            // iterate over the data result set


            var movieDiv = "<div class= 'movie-div col-md-4' id=" + movieID + ">"
            
            movieDiv += "<form class='delete-like' onsubmit='deleteLike(event)'>"
                  +  "<input type='submit' class='delete-btn' value='-' style='color:black'></input>"
                  +  "</form>";

            movieDiv += "<img src=" + result.Poster + " class='movie-image'><p class='text-lg'>" + result.Title + "</p></div>";


            $('.movies-grid').prepend(movieDiv);

          },
          //if theres an error with the AJAX request
          error: function(err){
            console.log("AJAX not working in render movies... ", err);
            }
          }); //end of AJAX

        }); //end of on submit

      },
      error: function(err) {
        console.log("render Likes: ", err);
      }
    });

};

//ADD MOVIES TO USERS
//newLike is a JSON object that is created in the AJAX request
function addMovieToUsers(event){

  //from the hidden input type in my_profile
  var userID = $('#user-id').attr("user-id");

  var imdbID = event.target.children[0].value;

  var newMovie = {
    imdbID: imdbID,
    userID: userID  //will use req.body.userID to push into users array
  };

  //posting to backend (can view on API LIKES)
  $.ajax({
    type: 'POST',
    url: '/api/users',
    data: newMovie,
    dataType: 'json',
    success: function(newMovie){
      console.log("POSTING TO MOVIES");
    },
    error: function(err) {
      console.log("issue with add movies POST: " + err);
    }
  });

  renderLikes();

};



// function to SEARCH FOR MOVIES (searchLikes.hbs template)
function getMovies(){

  //name of entire search form
  var $searchForm = $("#searchForm");
  //where the results will be appended
  var $searchResults = $(".search-results");
  //search term input (title)
  var $searchTerm = $('#searchTerm');
  //submit form to search OMDB API
  $searchForm.on('submit', function(event){
    //prevent from refreshing page
    event.preventDefault();
    //empty previous results
    $searchResults.empty();
    //save form data to variable
    var searchTerm = encodeURI($searchTerm.val());
    //ajax request to GET the movie with the title of the searchTerm
    $.ajax({
      type: 'GET',
      url: "https://www.omdbapi.com/?s=" + searchTerm,
     //v=1 is version 1, t means title
      dataType: 'json', //no data is being passed in
      success: function(result){
        console.log(result);
        var movie = "<div>";
        // iterate over the data result set
        $.each(result.Search, function(index, element) {

          //imdb ID since omdb ID isn't available?
          var imdbID = element.imdbID;

          console.log("IMDB ID ", imdbID);

          //adds a button to each movie (+)
          movie += "<div class='search-movie-item col-md-4'><form class='add-movie-btn' onsubmit='addMovieToUsers(event)'>"
                +  "<input class='hidden' type='hidden' value=" + imdbID + " name='like' id=" + imdbID + "></input>"
                +  "<input type='submit' value='+' style='color:black'></input>"
                +  "</form>";
          //if there is no poster URL then it just adds a default image
          if(element.Poster !== "N/A"){
              movie += "<img class='movie-image' src=" + element.Poster + " >";
          } else {
              movie += "<img class='movie-image' src='../images/no-photo-available.jpg'>";
          }
          movie += "<p class='text-lg'>" + element.Title + ", " + element.Year + "</p></div>";
        });

        movie += '</div>';

        // insert the html
        $searchResults.append(movie);
      },
      //if theres an error with the AJAX request
      error: function(err){
        console.log("AJAX not working... ", err);
      }
    }); //end of AJAX
    //reset form
    $searchForm[0].reset();
    $searchTerm.focus();
  }); //end of on submit
};//end of getMovies
