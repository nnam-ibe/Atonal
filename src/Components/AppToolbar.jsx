import React, {Component} from 'react';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import SearchBar, { activeType, searchMode } from './SearchBar'
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import '../App.css'

export default class AppToolbar extends Component {

    constructor(props) {
        super(props);
        this.state  = {
            activeType: activeType.ARTIST
        }
    }

    render() {
        return (
            <Toolbar className="app-toolbar">
                <ToolbarGroup>
                    <DropDownMenu value={this.state.activeType}
                                  onChange={this.handleTypeChange}
                                  className="toolbar-dropdown"
                    >
                        <MenuItem value={activeType.ARTIST} primaryText="Artist"/>
                        <MenuItem value={activeType.ALBUMS} primaryText="Album"/>
                        <MenuItem value={activeType.TRACKS} primaryText="Tracks"/>
                    </DropDownMenu>
                    <SearchBar activeType={this.state.activeType} searchMode={searchMode.LOOKUP}/>
                </ToolbarGroup>
            </Toolbar>
        )
    }

    handleTypeChange = (event, index, value) => {
        this.setState({
            activeType: value
        })
    }
}