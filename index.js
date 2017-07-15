var express = require('express');
var app = express();
var http = require("http");
var cors = require('cors');
var SpotifyWebApi = require("spotify-web-api-node");
var spotifyConfig = require('./src/Configurations/spotifyConfig');

var spotifyApi = new SpotifyWebApi({
    clientId : spotifyConfig.secrets.clientId,
    clientSecret : spotifyConfig.secrets.clientSecret
});

var access_token;
var token_valid;
var expiresIn;

process.env.NODE_ENV = 'ddevelopment';

app.set('port', (process.env.PORT || 9999));

app.use(cors());
app.use(express.static(__dirname + '/build'));

app.get('/', function(request, response) {
    response.sendFile(__dirname + '/build/index.html')
});

app.get('/access_token', function(req, res) {
    console.log('/access_token is called');
    console.log(access_token);

    if (!access_token || !expiresIn || (new Date().getTime() > expiresIn) ) {
        spotifyApi.clientCredentialsGrant()
            .then(function(data) {
                expiresIn = new Date().getTime() + ( data.body['expires_in'] * 1000 );
                console.log('The access token expires in ' + expiresIn);
                console.log('Current time ' + new Date().getTime());
                console.log('The access token is ' + data.body['access_token']);

                // Save the access token so that it's used in future calls
                access_token = data.body['access_token'];
                spotifyApi.setAccessToken(access_token);
                response = {
                    access_token: access_token
                };
                res.send(JSON.stringify(response));
            }, function(err) {
                console.log('Something went wrong when retrieving an access token', err.message);
            });
    } else {
        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(access_token);
        response = {
            access_token: access_token
        };
        res.send(JSON.stringify(response));
    }

});

app.listen(app.get('port'), function() {
    console.log("Express server started on port", app.get('port'))
});