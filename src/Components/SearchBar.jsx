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
        // var urlProd = "https://blooming-escarpment-43988.herokuapp.com/access_token";
        // var urlDev = 'http://192.168.0.13:9999/access_token';
        // fetch(urlProd, {mode: 'cors'})
        //     .then((response) => {
        //         return response.json();
        //     }).then((data) => {
        //         spotifyApi = new SpotifyWebApi({
        //             accessToken: data.access_token
        //         });
        //         console.log(data.access_token);
        //     });
        spotifyApi = new SpotifyWebApi({
            accessToken: 'BQBTzXcZTmDJH2HMAvia5qrNlugV6nTHwVCupCYE3ApKnfPZLeZ17qqqsJoDjouMeio23croZA8wKigjCoSj-Q'
        });
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
                  useLayerForClickAway={true}
              >
                  <List>
                      {this.state.data}
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

    handleRequestClose = () => {
        this.setState({ open: false });
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
                     return (
                        <ListItem
                            key={artist.id}
                            leftAvatar={<Avatar src={img} />}
                            primaryText={artist.name}
                        />
                    );
                });

                this.setState({
                    data: results
                });
            }, function (err) {
                console.error(err);
            });
    }

    searchAlbums(value) {
        spotifyApi.searchAlbums(value).then((data) => {
            console.log(`Search for Album: ${value}`, data);
            // var result = _.map(data.body.a)
            this.setState({
                data: []
            });
        });
    }

    searchTracks(value) {
        spotifyApi.searchTracks(value)
            .then((data) => {
                console.log(`Search for Tracks: ${value}`, data);
                var results = _.map(data.body.tracks.items, (track) => {
                    var secondaryText = Object.values(track.artists).map((k)=>{return k.name}).join(', ');
                    return (
                        <ListItem
                            key={track.key}
                            primaryText={track.name}
                            secondaryText={secondaryText}
                        />
                    );
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