import React, { Component } from 'react';
import Avatar from 'material-ui/Avatar';
import Popover from 'material-ui/Popover';
import TextField from 'material-ui/TextField';
import {List, ListItem} from 'material-ui/List';
import injectTapEventPlugin from 'react-tap-event-plugin';
import _ from 'lodash';
var SpotifyWebApi = require('spotify-web-api-node');
injectTapEventPlugin();

var spotifyApi;

class SearchBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            open: false,
            query: ''
        };
    }

    componentDidMount() {
        fetch('http://192.168.0.13:9999/access_token', {mode: 'cors'})
            .then((response) => {
                return response.json();
            }).then((data) => {
                spotifyApi = new SpotifyWebApi({
                    accessToken: data.access_token
                });
                console.log(data.access_token);
            });
        // spotifyApi = new SpotifyWebApi({
        //     accessToken: 'BQDMhQdxh7s7xEO9upYCrNqJCyrEuN_Nbp8QlmKNp6ZAYot7AEzquDuqSCDiq01f_I19MokYFSrrwKHqOrRotg'
        // });
    }

    render() {
        return (
          <div>
              <TextField
              hintText="Search"
              onChange={this.handleTextChange}/>
              <Popover
                  open={this.state.open}
                  anchorEl={this.state.anchorEl}
                  onRequestClose={this.handleRequestClose}
                  canAutoPosition={false}
              >
                  <List>
                      {
                          _.map(this.state.artists, (artist) => {
                              return (
                                  <ListItem
                                      key = {artist.key}
                                      leftAvatar={<Avatar src={artist.url} />}
                                      primaryText={artist.name}
                                  />
                              );
                          })
                      }
                  </List>
              </Popover>
          </div>
        );
    }

    handleTextChange = (event, newValue) => {
        if (newValue.length > 0) {
            switch (this.props.activeType) {
                case 1:
                    this.searchArtists(newValue);
                    break;
                case 2:
                    this.searchAlbums(newValue);
                    break;
                case 3:
                    this.searchTracks(newValue);
                    break;
                default:
                    this.searchArtists(newValue);
                    break;
            }

            this.setState({
                open: true,
                query: newValue,
                anchorEl: event.currentTarget
            });
        } else {
            this.setState({open: false, query: ''})
        }
    };

    searchArtists(value) {
        spotifyApi.searchArtists(value)
            .then((data) => {
                console.log(`Search for ${value}`, data);
                var results = _.map(data.body.artists.items, (artist) => {
                    var img ='';
                    if (artist.images.length !== 0) {
                        img = artist.images[0].url;
                    }

                    return {
                        key: artist.id,
                        name: artist.name,
                        url: img
                    };
                });

                this.setState({
                    artists: results
                });
            }, function (err) {
                console.error(err);
            });
    }

    searchAlbums(value) {
        spotifyApi.searchAlbums(value).then((data) => {
            console.log(`Search for Album: ${value}`, data);
            // var result = _.map(data.body.a)
        });
    }

    searchTracks(value) {
        spotifyApi.searchTracks(value)
            .then((data) => {
                console.log(`Search for Tracks: ${value}`, data);
                var results = _.map(data.body.tracks.items, (track) => {
                    return track.name;
                });

                this.setState({
                    data: results
                });
            }, function (err) {
                console.error(err);
            });
    }
}

export default SearchBar;