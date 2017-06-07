import React, {Component} from 'react';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import SearchBar from './SearchBar'
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import '../App.css'

export default class AppToolbar extends Component {

    constructor(props) {
        super(props);
        this.state  = {
            activeType: 1
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
                        <MenuItem value={1} primaryText="Artist"/>
                        <MenuItem value={2} primaryText="Album"/>
                        <MenuItem value={3} primaryText="Tracks"/>
                    </DropDownMenu>
                    <SearchBar activeType={this.state.activeType}/>
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