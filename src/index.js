import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import AppToolbar from './Components/AppToolbar';
import registerServiceWorker from './registerServiceWorker';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme  from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';

class App extends Component {

    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                <div className="app">
                    <div className="app-header">
                        <p><b>TONAL</b></p>
                    </div>
                    <AppToolbar />
                    <div className="app-body">
                    </div>
                </div>
            </MuiThemeProvider>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
