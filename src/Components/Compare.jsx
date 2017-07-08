import React, { Component } from 'react';
import LinearProgress from 'material-ui/LinearProgress';
import Paper from 'material-ui/Paper';
import _ from 'lodash';
import { spotifyApi } from '../index'
import '../App.css'

const paperStyle = {
    height: 150,
    width: '50%',
    margin: 5,
    textAlign: 'center',
    display: 'inline-block',
};

export default class Compare extends  Component {

    constructor(props) {
        super(props);

        this.fetchPageData(props);

        this.state = {
            showLoadingBar: true,
            artist1: [],
            artist2: [],
            collaborations: {
                loading: true
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({showLoadingBar: true});

    }

    render() {
        var elements = this.state.showLoadingBar && (<LinearProgress mode="indeterminate" />);

        if (!this.state.showLoadingBar) {
            elements = (
                <div className="compare-component">
                    <div className="compare-component-header">
                        <header className="compare-header">
                            <div className="compare-artist1" style={{backgroundImage: 'url('+ this.state.artist1.url + ')'}}>
                                <span className="followers">{this.state.artist1.followers}</span>
                                <h1 className="artist-name">{this.state.artist1.name}</h1>
                            </div>
                            <div className="compare-artist2" style={{backgroundImage: 'url('+ this.state.artist2.url + ')'}}>
                                <span className="followers">{this.state.artist2.followers}</span>
                                <h1 className="artist-name">{this.state.artist2.name}</h1>
                            </div>
                        </header>
                    </div>
                    <div className="compare-component-body">
                        <Paper style={paperStyle}>
                            <h1>HI</h1>
                        </Paper>
                    </div>
                </div>
            )
        }

        return elements;
    }

    fetchPageData(props) {
        this.fetchHeader(props);
        // this.fetchCollaborations(props);
    }

    fetchHeader(props) {
        var artistIds = [props.match.params.artist1, props.match.params.artist2];
        spotifyApi.getArtists(artistIds)
            .then((data) => {
                console.log(data); //TODO: Remove console log
                var url1 = '';
                var url2 = '';

                if (data.body.artists[0].images.length !== 0) {
                    url1 = data.body.artists[0].images[0].url;
                }

                if (data.body.artists[1].images.length !== 0) {
                    url2 = data.body.artists[1].images[0].url;
                }

                var artist1= {
                    name: data.body.artists[0].name,
                    followers: data.body.artists[0].followers.total,
                    url: url1
                };

                var artist2 = {
                    name: data.body.artists[1].name,
                    followers: data.body.artists[1].followers.total,
                    url: url2,
                };

                this.setState({
                    showLoadingBar: false,
                    artist1: artist1,
                    artist2: artist2,
                });

                this.fetchCollaborations(artist1.name + ' ' + artist2.name)
            })
    }

    fetchCollaborations(artistNames) {
        spotifyApi.search(artistNames, ['track'])
            .then((data) => {
                console.log(data); //TODO: Remove console log
                var trackNames = [];
                var tracklist = _.map(data.body.tracks.items, (item) => {
                    var track = {
                        name: item.name,
                        artists: _.map(item.artists, (artist) => {
                            return artist.name;
                        }).join(','),
                        ids: _.map(item.artists, (artist) => {
                            return artist.id;
                        }),
                    };

                    if ( _.includes(track.ids, this.props.match.params.artist1)
                        && _.includes(track.ids, this.props.match.params.artist2)
                        && ( trackNames.indexOf(track.name) === -1 ) ) {
                        trackNames.push(track.name);
                        return track;
                    }
                });
                tracklist = _.pickBy(tracklist, _.identity);
                console.log(tracklist); //TODO: Remove console log

                this.setState({
                    collaborations: {
                        loading: false,
                        tracklist: tracklist,
                    },
                })
            });
    }
}