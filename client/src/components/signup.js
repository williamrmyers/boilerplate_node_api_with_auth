import React from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import {Redirect} from 'react-router-dom';

class Signup extends React.Component {
  state = {
      error: undefined
  };
  handelSignup = (e, props) => {
    e.preventDefault();

    const formElements = e.target.elements;
    const firstName = formElements.firstName.value.trim();
    const lastName = formElements.lastName.value.trim();
    const email = formElements.email.value.trim();
    const password = formElements.password.value.trim();
    const error = false;



    // // Submit to server
    axios.post('/users', {
      "email": email,
      "first_name": firstName,
      "last_name": lastName,
      "password": password
    })
      .then((response) => {
        this.props.handelSubmit(response)
      }).catch((e) => {
        console.log(`Error Logging in` + e);
        this.setState(() => ({ error: "Error Signing up, please try again." }));
      });

  }
  render() {
    return (
      <div>
        <section className="section">
          <div className="container has-text-centered">
            <div className="box formBox">

            <h1 className="big-header">Sign Up!</h1>

            <form onSubmit={this.handelSignup}>
            <div className="field">
              <label className="label">First Name</label>
              <div className="control">
                <input className="input" type="text" placeholder="First Name" name="firstName"/>
              </div>
            </div>

            <div className="field">
              <label className="label">Last Name</label>
              <div className="controlclassName">
                <input className="input" type="text" placeholder="Last Name" name="lastName"/>
              </div>
            </div>

            <div className="field">
              <label className="label">Email</label>
              <div className="control has-icons-left has-icons-right">
                <input className="input" type="email" placeholder="Email" name="email"/>
                <span className="icon is-small is-left">
                  <i className="fas fa-envelope"></i>
                </span>
              </div>
              <p className="help">{this.state.error}</p>
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

export default Signup;
