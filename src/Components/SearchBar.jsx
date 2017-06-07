import React, { Component } from 'react';
import {AutoComplete} from 'material-ui'
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
        };

        this.handleUpdateInput = this.handleUpdateInput.bind(this);
    }

    componentDidMount() {
        // fetch('http://192.168.0.13:9999/access_token', {mode: 'cors'})
        //     .then((response) => {
        //         return response.json();
        //     }).then((data) => {
        //         spotifyApi = new SpotifyWebApi({
        //             accessToken: data.access_token
        //         });
        //         console.log(data.access_token);
        //     });

        spotifyApi = new SpotifyWebApi({
            accessToken: 'BQDCJQMfY19dC350oh4aa2qFukclTrkai5p6pGZA0zqIN7LQc-3cGB7GcUHcqUVpU-kJMOblK_RwY20RAgnZkQ'
        });
    }

    render() {
        return (
            <AutoComplete
                hintText="Search for an artist.."
                dataSource    = {this.state.data}
                filter={AutoComplete.noFilter}
                onUpdateInput = {this.handleUpdateInput}
            />
        );
    }

    handleUpdateInput(value) {
        if (value === '') {
            this.setState({
                data: []
            });
            return;
        }

        switch (this.props.activeType) {
            case 1:
                this.searchArtists(value);
                break;
            case 2:
                this.searchAlbums(value);
                break;
            case 3:
                this.searchTracks(value);
                break;
            default:
                this.searchArtists(value);
                break;
        }


    }

    searchArtists(value) {
        spotifyApi.searchArtists(value)
            .then((data) => {
                console.log(`Search for ${value}`, data);
                var results = _.map(data.body.artists.items, (artist) => {
                    return artist.name;
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
