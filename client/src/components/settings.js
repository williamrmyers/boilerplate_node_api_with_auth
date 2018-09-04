import React from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import NameChangeModal from './namechangemodal';
import Confirmation from './reusableComponents/confirmation'


class Settings extends React.Component {

  state = {
            firstName: null,
            lastName: null,
            email: null,
            NameChangeModalclosed: true,
            deleteModalclosed: true,
            redirect: false
          }

  getMeData = () => {
    const authHeaders = {
      headers: {'x-auth': this.props.token }
    };

    axios.get('/users/me', authHeaders)
      .then((response) => {
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
    const authHeaders = {
      headers: {'x-auth': this.props.token }
    };
    // Build request body
    const newNameBody = {};
    if (newName.firstName) {
      newNameBody.first_name = newName.firstName;
    }
    if (newName.lastName) {
      newNameBody.last_name = newName.lastName;
    }
    if (newName.email) {
      newNameBody.email = newName.email;
    }

    // Make Request
    axios.patch('/users/me', newNameBody, authHeaders)
      .then((response) => {
        this.toggleNameModal();
        // Update UI on success
        this.setState({
          firstName: newName.firstName,
          lastName: newName.lastName,
          email: newName.email
        });
      })
      .catch((error) => {
        console.log(error);
        alert('Could not change user info.')
      });
    this.getMeData();
  }

  toggleConfirmDeleteAccount = () => {
    this.setState(() => ({ deleteModalclosed: this.state.deleteModalclosed ? false : true }))
  }

  deleteAccount = (newName) => {

    const cookies = new Cookies();
    const authHeaders = { headers: {'x-auth': this.props.token }};

    // Make delete Request
    axios.delete('/users/me', authHeaders)
      .then((response) => {
        console.log('Deleted',response.data);
        // Delete token cookie
        cookies.remove('auth', { path: '/' });
        this.setState(() => ({ redirect: true }))
      })
      .catch((error) => {
        console.log(error);
        alert('Could not delete user.')
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
                          <strong>Email</strong>: {this.state.email} <br/>
                          <a onClick={this.toggleNameModal} className="button">Change Info</a> <br/>
                        </p>
                      {this.state.deleteModalclosed?
                        (<a onClick={this.toggleConfirmDeleteAccount} className="button">Delete Account</a>)
                        :
                        (<Confirmation
                            yes={this.deleteAccount}
                            no={this.toggleConfirmDeleteAccount}
                            isOpen = {!this.state.deleteModalclosed}
                            confirmationMessage={"Are you sure you want to delete your account?!"}
                            yesButtonStyle='is-danger'
                            />
                        )
                      }
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
                  email = {this.state.email}
                  />

                { this.state.redirect ? <meta httpEquiv="refresh" content="0; URL='/'" /> : null}
          </div>
        )}
      };
export default Settings;
