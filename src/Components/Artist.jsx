import React, { Component } from 'react';
import LinearProgress from 'material-ui/LinearProgress';
import SearchBar, { activeType, searchMode } from './SearchBar'
import { spotifyApi } from '../index'
import _ from 'lodash';


export default class Artist extends Component {

    constructor(props) {
        super(props);

        this.fetchPageData(props);

        this.state = {
            artist: [],
            showLoadingBar: true,
            topTracks: ''
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({showLoadingBar: true});
        if (nextProps.location !== this.props.location) {
            this.fetchPageData(nextProps);
        }
    }

    render() {
        var elements = this.state.showLoadingBar && (<LinearProgress mode="indeterminate" />);

        if (!this.state.showLoadingBar) {
            elements = (
                <div className="artist-component">
                    <div className="artist-component-header">
                        <header className="artist-header" style={{backgroundImage: 'url('+ this.state.headerImg + ')'}}>
                            <span className="followers">{this.state.followers}</span>
                            <h1 className="artist-name">{this.state.name}</h1>
                            <SearchBar activeType={activeType.ARTIST} searchMode={searchMode.COMPARE} artist1={this.props.match.params.artistId}/>
                        </header>
                    </div>
                    <div className="artist-component-body">
                        <div className="top-tracks">
                            <h1 className="top-tracks-header">Popular</h1>
                            <ol className="top-tracks-list">{this.state.topTracks}</ol>
                        </div>
                    </div>
                </div>
            )
        }
        return elements;
    }

    fetchPageData(props) {
        this.fetchHeaderImage(props);
        this.fetchTopTracks(props);
    }

    fetchHeaderImage(props) {
        spotifyApi.getArtist(props.match.params.artistId)
            .then((data) => {
                console.log(`Data for ${props.match.params.artistId}`, data); //TODO: Remove console log
                var url = '';
                if (data.body.images.length !== 0) {
                    url = data.body.images[0].url;
                }

                this.setState({
                    headerImg: url,
                    followers: data.body.followers.total,
                    name: data.body.name,
                    showLoadingBar: false
                });
            }, (err) => {
                console.error(err);
            });
    }

    fetchTopTracks(props) {
        spotifyApi.getArtistTopTracks(props.match.params.artistId, 'CA')
            .then((data) => {
                console.log(`Top tracks for ${props.match.params.artistId}`, data); //TODO: Remove console log
                var result = _.map(data.body.tracks, (track) => {
                    return (
                        <div key={track.id} className="track-item-div">
                            <li className="track-row">
                                <span className="track-name">
                                {track.name}
                            </span>
                            </li>
                        </div>
                    );
                });

                this.setState({topTracks: result})
            }, (err) => {
                console.error(err);
            })
    }
}
