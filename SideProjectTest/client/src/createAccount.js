import React from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import {BrowserRouter as Router} from 'react-router-dom';
import swal from 'sweetalert';
import CompanyLogo from './Logo.png'

import './App.css';

class Register extends React.Component {

  //message that info has been sent, need to reconfigure incase the entry is a duplicate.
onButtonCLickHandler = () => {
  

}
//imported from Schema and saved as strings so you can view in Web App console to see the inputs being stored; also used for Payload//
  state = {
    name: "", 
    email: "", 
    password: ""
  };

  componentDidMount = () => {
    
  };
//used for creating payload to send to MongoDB//
  getblogpost = () => {
    axios.get('/api')
      .then((response) => {
        const data = response.data;
        this.setState({ posts: data });
        console.log('Data has been received!!');
      })
      .catch(() => {
        alert('Error retrieving data!!!');
      });
  }
//Shows real time input from input boxes//
  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value });
  
  };


  submit = (event) => {   
    event.preventDefault();
    
//payload sent to Node.js to be posted in MongoDB//
    const payload = {
      name: this.state.name, 
      email: this.state.email, 
      password: this.state.password
    };

//estabishing connection to Node.js and MongoDB//
    axios({
      url: '/api/register',
      method: 'POST',
      data: payload
    })
      .then(() => {
        console.log('Data has been sent to the server');
        this.resetUserInputs();
        this.getblogpost();
        swal('Account has been created!', {
          className: "green-bg",
        })
      })
      .catch(() => {
        swal('The account alread exists' ,{
          className: "red-bg",
        });
        console.log('Internal server error');
      });;
  };

  resetUserInputs = () => {
    this.setState({
      name: "", 
      email: "", 
      password: "", 
    });
  };
  render() {

    console.log('State: ', this.state);

    

    //JSX
    return(
 
<Router>
    <div className="formContainer">
  
 
      {/* inputs for payload to be sent to DB */}
      <div className="app">
      <img className="photo" src= {CompanyLogo}></img>
     
        <h1 className="header1">Create your account:</h1>
        <br></br>
        <form onSubmit={this.submit}>
         {/* input text box's for needed payload */}
          <div className="form-input">
            <input 
              type="text"
              name="name"
              placeholder="Enter first and last name"
              value={this.state.name}
              onChange={this.handleChange}
            />
          </div>
  
          <div className="form-input">
            <input 
              type="text"
              name="email"
              placeholder="Enter email address"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </div>
         
          <div className="form-input">
            <input 
              type="password"
              name="password"
              placeholder="Enter a password"
              value={this.state.password}
              onChange={this.handleChange}
            />
          </div>

          <button onClick={this.submit} >Submit</button>
        </form>
        
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
</div>
   
      </div>
      </Router>
    
    );
  
  }
 
}

export default Register; 