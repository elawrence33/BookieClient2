// Must import userReducer to use reducers to manage complex state changes: 
import React, { useState, useReducer} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from './Components/navbar';
import Footer from './Components/Footer'
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import CompanyLogo from './Logo.png'

import './App.css';
import Skedda from './skedda';
// Class shows all past expenses from bookings
import Pass from './changePass';
// Class shows account information only for the currently logged in user
import Account from './Account'
// Class that allows the user to login to the app and is issued a token for authorization. This is the first page that the user will be directed to. 
import Login from './login';
import Invoice from './Invoice';

const loginStatus = localStorage.getItem("LoginStatus"); 

class App extends React.Component {

render() {

  return (
    
    <div id="appRoot">
      <Router>
              <Switch>
                <Route exact path='/' component={Login}></Route>

                <div>
                <NavBar />
                <Route exact path='/Skedda' component={Skedda}></Route>
                <Route exact path='/changePass' component={Pass}></Route>
                <Route exact path='/Account' component={Account}></Route>
                <Route exact path='/invoice' component={Invoice}></Route>
  
                
                <Footer />
                </div>
              </Switch>
      </Router>
      
    </div>
  
    )
  
}
}

export default App;