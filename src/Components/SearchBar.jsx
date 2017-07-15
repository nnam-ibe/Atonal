import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Avatar from 'material-ui/Avatar';
import Popover from 'material-ui/Popover';
import TextField from 'material-ui/TextField';
import { List, ListItem } from 'material-ui/List';
import _ from 'lodash';
import { spotifyApi } from '../index'

export const activeType = Object.freeze({
    ARTIST: 0,
    TRACKS: 2
});

export const searchMode = Object.freeze({
    LOOKUP: 0,
    COMPARE: 1
});

class SearchBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            open: false,
            query: ''
        };
    }

    render() {
        return (
          <div>
              <TextField
              hintText={this.props.searchMode === searchMode.LOOKUP ? "Search..." : "Compare to.." }
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
                case activeType.ARTIST:
                    this.searchArtists(newValue);
                    break;
                case activeType.TRACKS:
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

                    var listItem = (
                        <ListItem
                            key={artist.id}
                            leftAvatar={<Avatar src={img} />}
                            primaryText={artist.name}
                            onClick={ () => {this.setState( {open: false} )} }
                        />
                    );

                    if (this.props.searchMode === searchMode.LOOKUP) {
                        return (
                            <Link to={`/a/${artist.id}`}>
                                {listItem}
                            </Link>
                        );
                    } else {
                        return (
                            <Link to={`/compare/${this.props.artist1}/${artist.id}`}>
                                {listItem}
                            </Link>
                        );
                    }
                });

                this.setState({
                    data: results
                });
            }, function (err) {
                console.error(err);
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