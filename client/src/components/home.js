import React from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';

class Home extends React.Component {
  state = {
      error: undefined,
      text: undefined,
      token: undefined,
      kittens: []
  };

  setData = (data) => {
    this.setState(() => ({
      text: data.text,
      kittens: data.image
    }));
  }

  getMembersData = () => {
    const cookies = new Cookies();
    const token = cookies.get('auth');
    if (token) {
      const authHeaders = {
        headers: {'x-auth': token }
      };

      axios.get('/members', authHeaders)
        .then((response) => {
          this.setData(response.data)
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
      });
    }
  }

  // componentDidUpdate(nextProps, nextState) {
  //   this.getMembersData();
  // }

  componentWillMount() {
    this.getMembersData();
  }

  render() {
    return (
      <div>
        {this.props.isAuthenticated?
          (
            <section className="section">
              <div className="hero">
                <div className="hero-body">
                  <div className="container has-text-centered content">
                    <h3>Boom</h3>
                    <p>Your now logged in and requesting data from the server.</p>
                    <p>{this.state.text}</p>
                    {/*<img src={this.state.kittens[0]} alt="Another Cute Kitten"/>*/}
                  </div>
                </div>
              </div>
            </section>
          )
          :
          (
            <section className="section">
            <div className="hero">
              <div className="hero-body">
                <div className="container has-text-centered content">
                    <h1 className="big-header">Welcome!</h1>
                    <img src="https://media.giphy.com/media/CY9jl58dVtU2s/giphy.gif" alt="Cute Kitten"/>
                </div>
              </div>
            </div>
          </section>
          )
        }
      </div>
    );
  }
}

export default Home;
