
class SignupOld extends React.Component {
  state = {
    user: undefined
  }

  handleClick = () => {
    axios.post('https://mighty-falls-96437.herokuapp.com/users', {
      "email":  Math.random() +"@apple.com",
      "first_name":"Steve",
      "last_name":"Jobs",
      "password": "123abc!"
    })
      .then((response) => {
        console.log(response);
        this.setState(() => ({ user: response.data.email }));
      }).catch((e) => {
        console.log(`Error Logging in` + e);
      });
  }

  render() {
    return (
      <div>
        <h1>Signup</h1>
        <p>This is the Signup page.</p>
        <p>New user is {this.state.user}</p>
        <a onClick={this.handleClick} className="button Normal is-outlined">Submit</a>
      </div>
    );
  };
}


<PrivateRoute path="/settings" component={Settings} exact/>



//
  // This component takes a value and then renders text of that value.
  // When clicked if changes to a form,
const ToggleField = (props) => (
  <div>
    {
      props.active?
      (<input type="text" placeholder={props.placeholder} name={props.name} />)
      :
      (<p><strong>{props.header}</strong>{props.value}</p>)
    }
    <button onClick = {props.yes} className={`button ${props.yesButtonStyle}`} >Good</button>
    <button onClick = {props.no} className="button" >Cancel</button>
  </div>
);

<ToggleField
  value="email"
  active={true}
  name="email"
  header="Eamil:"

  />
