import React from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import {BrowserRouter as Router} from 'react-router-dom';
import swal from 'sweetalert';
import Swal from 'sweetalert2'; 

import './App.css';
import { set } from 'mongoose';

///options to use for MOU/NDA/IP
const options = [
  {
    label: "None",
    value: "None",
  },
  {
    label: "Signed/Completed",
    value: "Signed/Completed",
  },
  {
    label: "Sent to Business",
    value: "Sent to Business",
  },
  {
    label: "Recieved",
    value: "Recieved",
  }
];
//options for Phases
const options0 = [
  {
    label: "None",
    value: "None",
  },
  {
    label: "Phase 1",
    value: "Phase 1",
  },
  {
    label: "Phase 2",
    value: "Phase 2",
  },
  {
    label: "Phase 3",
    value: "Phase 3",
  }
];

const options1 = [
  {
    label: "None",
    value: "None",
  },
  {
    label: "On Going",
    value: "On Going",
  },
  {
    label: "Submitted",
    value: "Submitted",
  },
  {
    label: "Completed",
    value: "Completed",
  },
  {
    label: "Shaping",
    value: "Shaping",
  },
  {
    label: "Awarded",
    value: "Awarded",
  }
];

class Refund extends React.Component { 
    state = {
        holder: '',
        // Holds the new credits to be added to the old credits: 
        newCreds: '',
        // Holds the orginal credits that the user had before the refund. 
        oldCreds: '', 
        notes: '', 
        message: '',
        email: '',
        display: [],
        // used to only show the business names within the database. This can be used for a dynamic dropdown list:
        justName: [],
        // used to grab all of the data from the database:
        posts: [], 
      };
    
      componentDidMount = () => {
        this.getblogpost();
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
    
      handleChangeID = ({ target }) => {
        const { name, value } = target;
        this.setState({ [name]: value });
        // Slight delay so state can update: 
        setTimeout(() => { this.getSelectedCredits(this.state.posts); }, 10)
      };
      
      matchNameToId(smallBusiness, posts) {
          var tempIds = [];
          var count; 
          var tempNames = [];
          posts.map((post, index) => (
            tempNames[index] = post.smallBusiness
          ));
          posts.map((post, index) => ( 
            tempIds[index] = post.id
          ));
          for (var i = 0; i < tempNames.length; i++) { 
              if (tempNames[i] === this.state.smallBusiness) {
                count = i; 
              }
          }
          this.setState({ id: tempIds[count] })
          
      }
    
    
      submit = (event) => {   
        event.preventDefault();
        
        var creditTotal = parseInt(this.state.newCreds) + parseInt(this.state.oldCreds); 
    //payload sent to Node.js to be posted in MongoDB//
        const payload = {
          name: this.state.holder, 
          newCreds: creditTotal,
          message: this.state.notes,
          email: this.state.email
        };
    
    //estabishing connection to Node.js and MongoDB//
        axios({
            url: '/api/update-credits',
            method: 'PUT',
            data: payload
        })
          .then(() => {
            console.log('Data has been sent to the server');
            this.resetUserInputs();
            this.getblogpost();
            Swal.fire({
              title: 'Successful Refund!',
              text: 'A message will be sent to the holder for confirmation.',
              icon: 'success', 
              timer: 2000
            })
          })
          .catch(() => {
            Swal.fire({
              icon: 'error',
              title: 'Refund Error!',
              text: 'Unable to refund credits...',
              backdrop: 'rgba(203, 203, 203, 0.2)'
            })  
            console.log('Internal server error');
          });;
        
      };
    
      resetUserInputs = () => {
        this.setState({
          holder: '',
          newCreds: '',
          oldCreds: '', 
          notes: '', 
          message: ''
        });
      };
      titles = (posts, justName) => { 
        posts.map((post, index) => ( 
          justName[index] = post.name
        ));
        var options = []; 
        options[0] = ""
        for (var i = 0; i < justName.length; i++) { 
          options[i] = { value: justName[i], label: justName[i] }
          
        }
        return options
        
      };
      displayTitles(state) { 
          return (
            this.titles(this.state.posts, this.state.justName).map((options) => (
                <option value={options.value}>{options.label}</option>
            ))
          )
      };
      getSelectedCredits(posts) { 
        const tempUser = [];
        const tempCredits = [];
        const tempEmails = []; 
        var count; 
        // Getting just the holder names: 
        posts.map((post, index) => ( 
          tempUser[index] = post.name
        ))
        // Getting just the credits: 
        posts.map((post, index) => ( 
          tempCredits[index] = post.credits
        ))
        // Gettng just the emails for verification:
        posts.map((post, index) => (
          tempEmails[index] = post.email
        ))

        // Finding the location off the selected holder: 
        for (var i = 0; i < tempUser.length; i++) {
          if (tempUser[i] === this.state.holder) {
            count = i; 
          }
        }
        // Getting their email for verification: 
        this.setState({ email: tempEmails[count] }); 
        // Getting the user's credit balance: 
        this.setState({ oldCreds: tempCredits[count]});

      }
      render() {    
    
        //JSX
        return(
     
    
        <div className="formContainer">
      
     
          {/* inputs for payload to be sent to DB */}
          <div className="app">
         
            <h1 className="header1">Select a Holder to Refund: </h1>
            <br></br>
            <form onSubmit={this.submit}>
             {/* input text box's for needed payload */}
            <div className="dropdown">
            <select value={this.state.holder} name="holder" onChange={this.handleChangeID}>
                {this.displayTitles(this.state)}
            </select>
            </div>
            <br></br>

            <div className="form-input">
            <input
              type="number"
              name="newCreds"
              placeholder="Add Credits"
              value={this.state.newCreds}
              onChange={this.handleChange}
            />
            </div>
            <div className="form-input">
              
              <textarea
                type="text"
                name="notes"
                placeholder="Refund message to send to holder"
                value={this.state.notes}
                onChange={this.handleChange}
              />

          </div>
              
              <button>Submit</button>
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
          <br />
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
        
        
        );
      
      }
}
export default Refund; 