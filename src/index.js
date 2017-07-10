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
import Compare from './Components/Compare'
import './App.css'
import registerServiceWorker from './registerServiceWorker';
var SpotifyWebApi = require('spotify-web-api-node');

const history = createHistory();
export var spotifyApi;

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
                            <Route path="/compare/:artist1/:artist2" component={Compare}/>
                        </div>
                    </div>
                </MuiThemeProvider>
            </Router>
        )
    }

    componentWillMount() {
        var url = 'https://blooming-escarpment-43988.herokuapp.com/access_token';
        fetch(url, {mode: 'cors'})
            .then((response) => {
                return response.json();
            }).then((data) => {
            spotifyApi = new SpotifyWebApi({
                accessToken: data.access_token
            });
            console.log(data.access_token); //TODO: Remove console log
        });


        // var url = 'http://192.168.0.14:9999/access_token';
        // if (process.env.NODE_ENV === 'development') {
        //     spotifyApi = new SpotifyWebApi({
        //         accessToken: 'BQDxXay6VZ6cOrhmoLLtjFzFt0Udq5Ih5GQZDPUGAso1UHcjdAu0vxPNqDneK8t9xw0Z7-mw2G6fbi4FkX-OQA'
        //     });
        // } else {
        //     fetch(url, {mode: 'cors'})
        //         .then((response) => {
        //             return response.json();
        //         }).then((data) => {
        //         spotifyApi = new SpotifyWebApi({
        //             accessToken: data.access_token
        //         });
        //         console.log(data.access_token); //TODO: Remove console log
        //     });
        // }
    }

}

injectTapEventPlugin();
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
