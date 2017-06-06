import React, { Component } from 'react';
import './App.css';
import _ from 'lodash';


var SpotifyWebApi = require('spotify-web-api-node');

class App extends Component {

    constructor(props) {
        super(props);

        var spotifyApi = new SpotifyWebApi({
            accessToken: 'BQD-TLAY2lCpg7442trgtRj3x1W26ar_J4th_EdScmERMd9-dFjqhTEibMhir6Cg6j8iG0oIW70Ec8T_KUOFzw'
        });

        this.state = {
            spotifyApi: spotifyApi
        };
    }

    componentWillMount() {
        this.search();
    }

    render() {
        var artists = _.map(this.state.artists, (artist) => {
            var src = "";
            if ("undefined" !== typeof artist.images &&
                "undefined" !== typeof artist.images[0]) {
                src = artist.images[0].url;
            }
            return <li key={artist.id}><div className="artist-container">
                <img className="artist-img" src={src} alt="Artist"/>
                <b className="artist-name">{artist.name}</b>
                <i className="artist-genre">{artist.main_genre}</i>
            </div></li>
        });
        return (
            <div className="App">
                <div className="App-header">
                    <p><b>ATONAL</b></p>
                </div>
                <div className="mat-container">
                    <div className="mat-bar">
                        {/*<SearchBar />*/}
                        {/*<input id="search" ref="query" onChange={ (e) => { this.updateSearch(); } } className="search" placeholder="Search..." />*/}
                    </div>
                </div>
                <div className="artists-container">
                    <ul>{artists}</ul>
                </div>

            </div>
        );
    }

    updateSearch(event) {
        this.search(this.refs.query.value);
    }

    search(query = "Adeele") {
        this.state.spotifyApi.searchArtists(query).then((data) => {
            console.log(`Search for ${query}`, data);
            this.setState({
                accessToken: this.state.spotifyApi,
                artists: data.body.artists.items
            })
        }, function (err) {
            console.error(err);
        });


    }
}

export default App;
