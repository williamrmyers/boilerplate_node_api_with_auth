import React from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom';

class Login extends React.Component {
  state = {
      error: undefined
  };
  handelSignup = (e, props) => {
    e.preventDefault();

    const formElements = e.target.elements;
    const email = formElements.email.value.trim();
    const password = formElements.password.value.trim();
    const error = false;

    // // Submit to server
    axios.post('/users/login', {
      "email": email,
      "password": password
    })
      .then((response) => {
        this.props.handelSubmit(response);
        console.log(response);
      }).catch((e) => {
        console.log(`Error Logging in` + e);
        this.setState(() => ({ error: 'There was an error logging in please try again.' }));
      });
  }

  render() {
    return (
      <div>
        <section className="section">
          <div className="container has-text-centered">
            <div className="box formBox">

            <h1 className="big-header">Login</h1>

            <form onSubmit={this.handelSignup}>
            <div className="field">
              <label className="label">Email</label>
              <div className="control has-icons-left has-icons-right">
                <input className="input" type="email" placeholder="Email" name="email"/>
                <span className="icon is-small is-left">
                  <i className="fas fa-envelope"></i>
                </span>
              </div>
            </div>

            <div className="field">
              <label className="label">Password</label>
              <p className="control has-icons-left">
                <input className="input" type="password" placeholder="Password" autoComplete="true" name="password"/>
                <span className="icon is-small is-left">
                  <i className="fas fa-lock"></i>
                </span>
              </p>
              <p className="help">{this.state.error}</p>
            </div>

            <div className="field is-grouped">
              <div className="control">
                <button className="button is-link">Submit</button>
              </div>
            </div>
            </form>
          </div>
          </div>
        </section>
        { this.props.isAuthenticated ? <Redirect to='/' /> : null}
      </div>
    );
  }
}

export default Login;
