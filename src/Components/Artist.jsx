import React, { Component } from 'react';
import { spotifyApi } from '../index'


export default class Artist extends Component {

    constructor(props) {
        super(props);

        this.state = {
            headerImg: ''
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location !== this.props.location) {
            this.fetchHeaderImage(nextProps);
        }
    }

    render() {
        return (
            <div className="artist-component">
                <div className="artist-header">
                    <img src={this.state.headerImg} alt="Cover"/>
                </div>
                <div className="artist-body">
                    <p>{this.props.match.params.artistId}</p>
                </div>
            </div>
        );
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
                    headerImg: url
                });
            }, (err) => {
                console.error(err);
            });
    }
}
