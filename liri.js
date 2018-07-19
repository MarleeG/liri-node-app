require("dotenv").config();
var request = require('request');
var fs = require("fs");

var Spotify = require("node-spotify-api");
var Twitter = require("twitter");

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var command = process.argv[2];
var item = process.argv.slice(3).join(" ");
var divider = "\n---------------------------------------------------------------------------------------------\n";
var newLine = "\n\n";

if (!item && command === "spotify-this-song") {
    item = "Flawless";
} else if (!item && command === "movie-this") {
    item = "Mr. Nobody";
}


if (command === "my-tweets") {
    myTweets();
} else if (command === "spotify-this-song") {
    spotifyThis();
} else if (command === "movie-this") {
    movieThis();
} else if (command === "do-what-it-says") {
    doWhatItSays();
}

function myTweets() {
    var params = { screen_name: 'lifeIsButADrea9' };

    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        var content = ""; 

        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                content += "Recent Tweets \n" + (i + 1) + "." + " " + tweets[i].text;
            }
        } else if (error) {
            content = "err";
            console.log(content);
        }
        console.log(content);
        appending(content + divider);
    });
}

function spotifyThis() {
    spotify.search({ type: 'track', query: item }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var name = data.tracks.items[0].album.artists[0].name;
        var song = data.tracks.items[0].name;
        var previewLink = data.tracks.items[0].album.artists[0].href;
        var album = data.tracks.items[0].album.name;

        var content = "Artist(s): " + name + newLine + "Song: " + song + newLine +
            "Album: " + album + newLine + "Link: " +
            previewLink + divider
        console.log(content);

        appending(content);
    });
}

function movieThis() {
    request('http://www.omdbapi.com/?i=tt3896198&apikey=47b4ac9&t=' + item, function (error, response, body) {
        var movie = JSON.parse(body);

        var title = movie.Title;
        var yearOfRelease = movie.Released;
        var imdbRating = movie.Ratings[0].Value;
        var rottenTomatoRating = movie.Ratings[1].Value;
        var productionCountry = movie.Country;
        var movieLang = movie.Language;
        var moviePlot = movie.Plot;
        var movieActors = movie.Actors;

        var content = newLine + "Title: " + title + newLine + "Year of release: " + yearOfRelease + newLine +
            "IMDB Rating: " + imdbRating + newLine + "Rotten Tomato Rating: " + rottenTomatoRating + newLine + "Country of Production: "
            + productionCountry + newLine + "Movie Language(s): " + movieLang + newLine + "Movie Plot: " + moviePlot + newLine
            + "Movie Actor(s): " + movieActors + divider;

        console.log(content);
        appending(content);
    });
}

function doWhatItSays() {
    fs.readFile('random.txt', 'utf8', function (error, data) {

        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(",");
        command = dataArr[0];
        item = dataArr[1];
        spotifyThis();

        appending(spotifyThis());
    });
}

function appending(content) {
    fs.appendFile("log.txt", content, "utf8", function (err) {

        if (err) {
            console.log(err);
        }
        else {
            console.log("Content Added!");
        }
    });
}