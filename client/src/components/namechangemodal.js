import React from 'react';
import Modal from 'react-modal';
import Confirmation from './reusableComponents/confirmation';

class NameChangeModal extends React.Component {

  state = {
      newFirstName: false,
      newLastName: false,
      confirmation: false,
  }

  confirmedChange = () => {
    const newName = {
      firstName: this.state.newFirstName,
      lastName: this.state.newLastName
    }
    this.props.changeNameOnServer(newName);
    this.hideConfirmation();
  }
  hideConfirmation = () => {
    this.setState(() => ({
      confirmation:false
    }))
  }
  displayConfirmation = () => {
    this.setState(() => ({
      confirmation:true
    }))
  }

  changeNameSubmit = (e) => {
    e.preventDefault();

    const newName = {
      firstName: e.target.elements.firstName.value.trim(),
      lastName: e.target.elements.lastName.value.trim()
    }
    this.setState(() => ({
      newFirstName : newName.firstName,
      newLastName: newName.lastName
      })
    );
    // this.props.getNewNameFromModal(newName);
    this.displayConfirmation();

    e.target.elements.firstName.value = "";
    e.target.elements.lastName.value = "";
  }

  render () {

    const customStyles = {
      content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
      }
    };

    return (
      <Modal
      isOpen = {this.props.isOpen}
      contentLabel = 'example model'
      onRequestClose={this.props.toggleNameModal}
      style={customStyles}
      >

        {this.state.confirmation ?
          (
            <Confirmation
            yes = {this.confirmedChange}
            no = {this.hideConfirmation}
            confirmationMessage = 'Are you sure you want to change your name?'
            yesButtonStyle='is-danger'
            ariaHideApp={false}

            />)
          :
          (
            <form onSubmit={this.changeNameSubmit}>
              <div className="field">
                <label className="label">First Name</label>
                <div className="control">
                  <input className="input" type="text" placeholder="New First Name" name="firstName"/>
                </div>
              </div>

              <div className="field">
                <label className="label">Last Name</label>
                <div className="controlclassName">
                  <input className="input" type="text" placeholder="New Last Name" name="lastName"/>
                </div>
              </div>
              <div className="field is-grouped">
              <div className="control">
                <button className="button is-link">Submit</button>
              </div>
              <div className="control">
                <button onClick={this.props.toggleNameModal} className="button">Cancel</button>
              </div>
              </div>
            </form>)
          }
        </Modal>
      );
    }
}

export default NameChangeModal;
