import React from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import NameChangeModal from './namechangemodal';
import {Redirect} from 'react-router-dom';


class Settings extends React.Component {

  state = {
            firstName: null,
            lastName: null,
            email: null,
            NameChangeModalclosed: true,
            showDeleteConfirmation: false,
            redirect: false
          }

  setMessage = (message) => {
    this.setState(() => ({ text: message }));
  }

  getMeData = () => {
    // get Headers from cookie
    const cookies = new Cookies();
    const token = cookies.get('auth');
    console.log(token);

    const authHeaders = {
      headers: {'x-auth': token }
    };

    axios.get('https://radiant-tor-41424.herokuapp.com/users/me', authHeaders)
      .then((response) => {
        this.setMessage(response.data.text)
        this.setState({
          firstName:response.data.first_name,
          lastName:response.data.last_name,
          email:response.data.email
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
// Name Changing Methods
  toggleNameModal = (state) => {
    this.setState(() => ({ NameChangeModalclosed: this.state.NameChangeModalclosed ? false : true }))
  }
  componentWillMount() {
    this.getMeData();
  }

  changeNameOnServer = (newName) => {
    // get Headers from cookie
    const cookies = new Cookies();
    const token = cookies.get('auth');
    console.log(token);

    const authHeaders = {
      headers: {'x-auth': token }
    };
    console.log(newName);
    // Build request body
    const newNameBody = {};
    if (newName.firstName) {
      newNameBody.first_name = newName.firstName;
    }
    if (newName.lastName) {
      newNameBody.last_name = newName.lastName;
    }
    console.log('newNameBody ',newNameBody);

    // Make Request
    axios.patch('https://radiant-tor-41424.herokuapp.com/users/me', newNameBody, authHeaders)
      .then((response) => {
        console.log(response.data);
        this.toggleNameModal();
      })
      .catch((error) => {
        console.log(error);
      });
    this.getMeData();
  }

  deleteAccount = (newName) => {
    // get Headers from cookie
    const cookies = new Cookies();
    const token = cookies.get('auth');
    const authHeaders = { headers: {'x-auth': token }};

    // Make Request
    axios.delete('https://radiant-tor-41424.herokuapp.com/users/me', authHeaders)
      .then((response) => {
        console.log('Deleted',response.data);
        cookies.remove('auth', { path: '/' });
        this.setState(() => ({ redirect: true }))
      })
      .catch((error) => {
        console.log(error);
      });
  }


render () {
  return (
          <div>
            <section className="section">
                  <div className="hero">
                    <div className="hero-body">
                      <div className="container has-text-centered content">
                        <h3>Your Profile</h3>
                        <p>
                          <strong>First Name:</strong> {this.state.firstName} <br/>
                          <strong>Last Name:</strong> {this.state.lastName} <br/>
                          <a onClick={this.toggleNameModal} className="button">Change</a> <br/>
                          <strong>Email</strong>: {this.state.email} <br/>
                          <a className="button">Change</a> <br/>
                        </p>
                      <br/>
                      <a onClick={this.deleteAccount} className="button">Delete Account</a>
                      </div>
                    </div>
                  </div>
                </section>
                <NameChangeModal
                  isOpen = {!this.state.NameChangeModalclosed}
                  changeNameOnServer = {this.changeNameOnServer}
                  toggleNameModal = {this.toggleNameModal}
                  ClassName = 'MyModal'
                  firstName = {this.state.firstName}
                  lastName = {this.state.lastName}
                  />

                { this.state.redirect ? <meta httpEquiv="refresh" content="0; URL='/'" /> : null}
          </div>
        )}
      };
export default Settings;
