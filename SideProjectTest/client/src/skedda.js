// Authors: Eli Lawrence, Tyler Seamans
// Date: 8/11/2021

import React from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import {BrowserRouter as Router} from 'react-router-dom';
import swal from 'sweetalert';


import './App.css';

// Global Variables: 
// Used to hold just the prices in the booking_records
var justPrices = [];
// Used hold just Credits from the booking_records
var justCredits = [];
// Used to hold just the names from credit_users
var justNames = [];
// Used to hold the holders from the booking_records
var justHolders = [];

var initLength = 0; 


class Skedda extends React.Component {


    state = { 
        // This is needed to pull data form mongo. Here is where all data from user-credits will be saved to
        posts1: [],
        // posts2[] will be used to gather the booking information. Here we are specifically 
        // looking for the pricing. 
        posts2: [], 
        // This is the starting size of the database. If this size grows we need to ensure we deduct the credits from that user
        startingSize: 0, 
        startingSize2: 0, 
        newData: false,
        
    }
    
    componentDidMount = () => {
        this.getblogpost();
        this.getbookingpost();
      };
    // getblogpost gets data from user_credits collection. The name for this function is there becuase this was pull
    // from a tutorial that we had found. 
      getblogpost = () => {
        axios.get('/api')
          .then((response) => {
            const data = response.data;
            this.setState({ posts1: data });
            console.log('Data has been received!!');
          })
          .catch(() => {
            alert('Error retrieving data!!!');
          });
      }
      // This is used to gather the data in the booking_records collection.
      getbookingpost = () => {
        axios.get('/api/booking')
          .then((response) => {
            const data = response.data;
            this.setState({ posts2: data });
            console.log('Data has been received!!');
          })
          .catch(() => {
            alert('Error retrieving data!!!');
          });
      }
      getInitialLength(posts2) { 
        console.log("This is what the original should be: " + posts2.length);
        initLength = posts2.length;
      }
      
      justPricesFunc(posts2) { 
          posts2.map((post, index) => (
              justPrices[index] = post.pricing
          ))
      };
      // Gets a list of just names from the user accounts
      justNamesFunc(posts1) { 
        posts1.map((post, index) => (
            justNames[index] = post.name
        ))
      };
      justHoldersFunc(posts2) { 
          posts2.map((post, index) => ( 
              justHolders[index] = post.holder
          ))
      };
      justCreditsFunc(posts1) { 
          posts1.map((post, index) => (
              justCredits[index] = post.credits
          ))
      };

    justGetItAll() {
      this.justCredits(this.state.posts1); 
      this.justHolders(this.state.posts2);
      this.justNames(this.state.posts1);
      this.justPrices(this.state.posts2);
      
    };
    test() { 
      console.log("This is the size of the booking records: " + this.state.posts2.length);
    }
  
      
    updateCredits() {
      this.getbookingpost();
      this.getblogpost();
      this.test();
      this.justCreditsFunc(this.state.posts1); 
      this.justHoldersFunc(this.state.posts2);
      this.justNamesFunc(this.state.posts1);
      this.justPricesFunc(this.state.posts2);

      console.log("This is the initLength: " + initLength);
      // Comparing the original size of the booking_records collection to the current size after a meeting has been added:  
      if (initLength === this.state.posts2.length) { 
        console.log("They are equal!");
      } else { 
        console.log("They are not equal!"); 
      }
      
      // This grabs the most recent charge
      var lastPrice = justPrices[justPrices.length - 1]; 
      var lastHolder = justHolders[justHolders.length - 1];
      // This will be used to count how many times a name was matched.
      // If no name was matched then a error message will populate telling the
      // user that there was no known match in the database. 
      var swalCount = 0;
      // This will show the new amount of credits to give back to the user
      var newCreds = 0; 
      // This holds the index value for where the most recent Holder matches the user name in the user_credits.
      var count; 
      for (var i = 0; i < justNames.length; i++) {
        if (justNames[i] === lastHolder) { 
          count = i; 
          swalCount++; 
        }
        console.log('We didnt make it in the if: line 122');
      }
      console.log(swalCount);
      if (swalCount > 0) { 
        newCreds = justCredits[count] - lastPrice; 
        swal('The credits have been deducted and saved to the user account!', {
          className: "green-bg"
        })
        const payload = {
          name: justNames[count],
          credits: newCreds
        }
        axios({
          url: '/api/update',
          method: 'PUT',
          data: payload
        })
        .then(() => {
          console.log('Data has been sent to the server, line: 140');
          // This does not cause the ERR_HEADERS_SENT error:
          this.getblogpost();
          swal('Information has been sent to Database', {
            className: "green-bg",
          })
        })
        .catch(() => {
          swal('The Information was NOT sent to the Database' ,{
            className: "red-bg",
          });
          console.log('Internal server error');
        });;
      } else { 
        swal('Error occured or the holder does not have a user account.', {
          className: "red-bg",
        })
      }
      // email the user: 
      
    }
    
    render () { 
        return (
            <div>
                {/* This was originally used to get the inital size of the booking records when I attempted to have the credits charged
                automatically:  */}
                {/* {this.getInitialLength(this.state.posts2)} */}
                {/* <button className="sendCharges" onClick={this.updateCredits.bind(this)}>Send Charges</button> */}
                <iframe title="Skedda" src="https://catalystcampusco.skedda.com/booking?embedded=true" >Loading...</iframe>
                
            </div>
        )
    }
}

export default Skedda;