import React, { Component } from 'react';
import LinearProgress from 'material-ui/LinearProgress';
import { spotifyApi } from '../index'


export default class Artist extends Component {

    constructor(props) {
        super(props);

        this.state = {
            artist: [],
            showLoadingBar: true
        };

        this.fetchHeaderImage(props);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({showLoadingBar: true});
        if (nextProps.location !== this.props.location) {
            this.fetchHeaderImage(nextProps);
        }
    }

    render() {
        var elements = this.state.showLoadingBar && (<LinearProgress mode="indeterminate" />);

        if (!this.state.showLoadingBar) {
            elements = (
                <div className="artist-component">
                    <header className="artist-header" style={{backgroundImage: 'url('+ this.state.headerImg + ')'}}>
                        <span className="followers">{this.state.followers}</span>
                        <h1 className="artist-name">{this.state.name}</h1>
                    </header>
                    <div className="artist-top-tracks">
                        Att
                    </div>
                </div>
            )
        }


        return elements;
    }

    fetchHeaderImage(nextProps) {
        spotifyApi.getArtist(nextProps.match.params.artistId)
            .then((data) => {
                console.log(`Data for ${nextProps.match.params.artistId}`, data);
                var url = '';
                if (data.body.images.length !== 0) {
                    url = data.body.images[0].url;
                }

                this.setState({
                    headerImg: url,
                    followers: data.body.followers.total + ' FOLLOWERS',
                    name: data.body.name,
                    showLoadingBar: false
                });
            }, (err) => {
                console.error(err);
            });
    }
}
