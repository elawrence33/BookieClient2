import React from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import {BrowserRouter as Router} from 'react-router-dom';
import swal from 'sweetalert';
import Swal from 'sweetalert2';
import CompanyLogo from './Logo.png'

// Imported to allow react to redirect user to a differenct page: 
import { Redirect } from "react-router-dom";

import './App.css';

class changePass extends React.Component {

//imported from Schema and saved as strings so you can view in Web App console to see the inputs being stored; also used for Payload//
  state = { 
    email: "", 
    password: "", 
    passwordValid: "",
    isMatching: "",
    redirect: null
  };

  componentDidMount = () => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem('email');
    this.setState({ email: email }); 
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

        // Need to check if both passwords match
        if (this.state.password === this.state.passwordValid) {
            //payload sent to Node.js to be posted in MongoDB//
            const payload = {
                email: this.state.email, 
                password: this.state.password
            };

            //estabishing connection to Node.js and MongoDB//
            axios({
                url: '/api/update-auth',
                method: 'PUT',
                data: payload
                })
                .then(response => {
                    this.resetUserInputs();
                    localStorage.setItem("token", response.data.token);
                    Swal.fire({
                      icon: 'success', 
                      title: 'Password Changed',
                      timer: 2000
                    })
                    // Rerouting the user to the homepage. 
                    this.setState({ redirect: "/Skedda" })
                })
                .catch(() => {
                  Swal.fire({
                    icon: 'warning', 
                    title: 'Invalid Input', 
                    text: 'Please fill all fields with an existing email.'
                  })
                    console.log('Internal server error');
                });;

            // Executes if the passwords do not match: 
            } else { 
                swal('Passwords DO NOT match!' ,{
                    className: "red-bg",
                    });
                this.resetUserInputs();
            } 

    };

    resetUserInputs = () => {
        this.setState({ 
        email: '', 
        password: '', 
        });
    };
  render() {


    // This is used to redirect the user to the homepage only if the 
    // sate has changed to the '/' route. 
    if (this.state.redirect) { 
      return <Redirect to={this.state.redirect} /> 
    }

    //JSX
    return(
 
<Router>
    <div className="formContainer">
    
      {/* inputs for payload to be sent to DB */}
      <div className="app">
      <img className="photo" src= {CompanyLogo}></img>
     
        <h1 className="header1">Enter a new password:</h1>
        <br></br>
        <form onSubmit={this.submit}>
         {/* input text box's for needed payload */}

         {/* <div className="form-input">
            <input 
              type="text"
              name="email"
              placeholder="Enter your email address"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </div> */}

          <div className="form-input">
            <input 
              type="password"
              name="password"
              placeholder="Enter your new password"
              value={this.state.password}
              onChange={this.handleChange}
            />
          </div>
  
          <div className="form-input">
            <input 
              type="password"
              name="passwordValid"
              placeholder="Please re-enter your new password"
              value={this.state.passwordValid}
              onChange={this.handleChange}
            />
          </div>

          <button onClick={this.submit}>Submit</button>
          
        </form>
        
      
</div>
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
      </div>
      </Router>
    
    );
  
  }
 
}

export default changePass;