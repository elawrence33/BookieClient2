import React from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import '../App.css';
import swal from 'sweetalert';
import Swal from 'sweetalert2';

// Imported to allow react to redirect user to a differenct page: 
import { Redirect } from "react-router-dom";

class NavBar extends React.Component {
  state = { 
    redirect: null
  }

  // Information on arrow functions: https://www.w3schools.com/js/js_arrow_function.asp 
  clearCache = () => { 
    const token = localStorage.clear();
    console.log("This is the clearCache token: " + token);
    this.setState({ redirect: "/"})
  }

  render() { 
    // In between the render and the return is where we can make decisions on what to display: 
    if (this.state.redirect) {
      Swal.fire({
        icon: 'success', 
        title: 'Logged Out',
        text: 'Successful Logout, come back soon!'
      })
      return <Redirect to={this.state.redirect} /> 
    }
    return(
      <div>
      <nav class="navbar navbar-dark navbar-expand-lg navbar-light bg-dark">
      <a class="navbar-brand" href="/Skedda">Bookie</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <a class="nav-link" href="/Skedda">Skedda</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/changePass">Change Password</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/Account">My Account Info</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/Invoice">Invoice</a>
          </li>
          <li className="nav-item"> 
            <button className="logoutButton" onClick={this.clearCache}>Logout</button>
          </li>
        </ul>
        
      </div>
    </nav>
    </div>
              
    )
  }
}
  

export default NavBar