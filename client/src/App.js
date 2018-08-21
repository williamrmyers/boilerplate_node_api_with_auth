import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Link, NavLink, Redirect} from 'react-router-dom';
import './App.css'
import Cookies from 'universal-cookie';
import axios from 'axios';
// Routes
import Home from './components/home';
import Header from './components/header';
import Private from './components/private';
import Signup from './components/signup';
import Login from './components/login';
import Settings from './components/settings';
import NotFound from './components/notFound';

// Currently App.js will contain the router.

let isAuthenticated = false;

// This function serves to tell the routes whether the user is autheticated ot not
// And manages the cookies.
const auth = {
  isAuthenticated: false,
  authenticate(token ,cb) {
    this.isAuthenticated = true;
    this.token = token;
    // Sets cookie
    const cookies = new Cookies();
    cookies.set('auth', token, { path: '/' });
  },
  loggout(cb) {
    this.isAuthenticated = false
    // Delete Cookie
    const cookies = new Cookies();
    cookies.remove('auth', { path: '/' })
  }
}

// This is a custom route privitisation method.
// https://tylermcginnis.com/react-router-protected-routes-authentication/
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    auth.isAuthenticated
      ? <Component {...props} />
      : <Redirect to={{
          pathname: '/login',
          state: { from: props.location }
        }} />
  )} />
)

class AppRouter extends Component {
  constructor() {
    super();
  }

  state = {
    token: false,
    authenticated: false,
    user: {}
  };

  logOut = (token) => {
    auth.loggout(() => {
      console.log(`Logout`);
    });

    const authHeaders = { headers: {'x-auth': this.state.token } };
    // Deletes token from database
    axios.delete('/users/me/token', authHeaders)
      .then((response) => {
        console.log(response.data);
        // this.setMessage(response.data.text)
        this.setState(() => ({
          authenticated: false
        }));
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Gets data from forms to
  handelSubmit = (response) => {
    auth.authenticate(response.data.token,() => {
      console.log('Auth Triggered');
    });

    this.setState(() => ({
      authenticated: true,
      token: response.data.token,
      user: { email: response.data.email }
    }));
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Route render={(props) => <Header {...props} isAuthenticated={this.state.authenticated} logOut={this.logOut} />}/>
          <Switch>
              <Route path="/" render={(props) => <Home {...props} isAuthenticated={this.state.authenticated} token={this.state.token} />} exact/>
              <Route path="/signup" exact render={(props) => <Signup {...props} isAuthenticated={this.state.authenticated} handelSubmit={this.handelSubmit} />} />
              <Route path="/login" exact render={(props) => <Login {...props} isAuthenticated={this.state.authenticated} handelSubmit={this.handelSubmit} />} />
              <PrivateRoute path="/settings" component={Settings} exact/>
              <Route component={NotFound}/>
          </Switch>
        </div>
      </BrowserRouter>
    )
  }
}

export default AppRouter;
