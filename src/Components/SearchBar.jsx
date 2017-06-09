import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Avatar from 'material-ui/Avatar';
import Popover from 'material-ui/Popover';
import TextField from 'material-ui/TextField';
import {List, ListItem} from 'material-ui/List';
import _ from 'lodash';
import {spotifyApi} from '../index'


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
                         <Link to={`/a/${artist.id}`}>
                             <ListItem
                                 key={artist.id}
                                 leftAvatar={<Avatar src={img} />}
                                 primaryText={artist.name}
                                 onClick={ () => {this.setState( {open: false} )} }
                             />
                         </Link>
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