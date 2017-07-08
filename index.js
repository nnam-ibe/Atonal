var express = require('express');
var app = express();
var http = require("http");
var cors = require('cors');
var SpotifyWebApi = require("spotify-web-api-node");
var config = require('./spotifyConfig');

var spotifyApi = new SpotifyWebApi({
    clientId : config.clientId,
    clientSecret : config.clientSecret
});

process.env.NODE_ENV = 'ddevelopment';

app.set('port', (process.env.PORT || 9999));

app.use(cors());
app.use(express.static(__dirname + '/build'));

app.get('/', function(request, response) {
    response.sendFile(__dirname + '/build/index.html')
});

app.get('/access_token', function(req, res) {
    spotifyApi.clientCredentialsGrant()
        .then(function(data) {
            console.log('The access token expires in ' + data.body['expires_in']);
            console.log('The access token is ' + data.body['access_token']);
            // Save the access token so that it's used in future calls
            spotifyApi.setAccessToken(data.body['access_token']);
            response = {
                access_token: data.body['access_token']
            };

            res.send(JSON.stringify(response));
        }, function(err) {
            console.log('Something went wrong when retrieving an access token', err.message);
        });
});

app.listen(app.get('port'), function() {
    console.log("Express server started on port", app.get('port'))
});