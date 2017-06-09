import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme  from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import AppToolbar from './Components/AppToolbar';
import Artist from './Components/Artist';
import './App.css';
import registerServiceWorker from './registerServiceWorker';
var SpotifyWebApi = require('spotify-web-api-node');

export var spotifyApi;
const history = createHistory();

class App extends Component {

    render() {
        return (
            <Router history={history}>
                <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                    <div className="app">
                        <div className="app-header">
                            <AppToolbar />
                        </div>
                        <div className="app-body">
                            <Route path="/a/:artistId" component={Artist}/>
                        </div>
                    </div>
                </MuiThemeProvider>
            </Router>
        )
    }

    componentWillMount() {
        var url = 'https://blooming-escarpment-43988.herokuapp.com/access_token';
        if (process.env.NODE_ENV === 'production') {
            url = 'https://blooming-escarpment-43988.herokuapp.com/access_token';
        } else if (process.env.NODE_ENV === 'ddevelopment') {
            url = 'http://192.168.0.13:9999/access_token'
        }

        if (process.env.NODE_ENV === 'development') {
            spotifyApi = new SpotifyWebApi({
                accessToken: 'BQA0I_n3Px3L98QiwP_6fS2esqMzgx5sqjwpAmZQ35q-kLWiC2kYXHDSk88XAXd2Uaww38IVHiWOH4g-60YwkA'
            });
        } else{
            fetch(url, {mode: 'cors'})
                .then((response) => {
                    return response.json();
                }).then((data) => {
                spotifyApi = new SpotifyWebApi({
                    accessToken: data.access_token
                });
                console.log(data.access_token);
            });
        }
    }

}

injectTapEventPlugin();
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
