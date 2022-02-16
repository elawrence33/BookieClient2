// import React from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import {BrowserRouter as Router} from 'react-router-dom';
import swal from 'sweetalert';
import CompanyLogo from './Logo2.png';

import './App.css';

// True or False options 
const trueOrFalse = [
  {label: 'none', value: 'none'},
  {label: 'true', value: 'true'}, 
  {label: 'false', value: 'false'}
]
const criteriaOptions = [
    {value: "None", label: "None"}, 
    {value: "Holder Name", label: "Holder Name"}, 
  ]

// Global Variables: 
// Used to hold just the prices in the booking_records
var justPrices = [];
// Used hold just Credits from the booking_records
var justCredits = [];
// Used to hold just the names from credit_users
var justNames = [];
// Used to hold the holders from the booking_records
var justHolders = [];
// Used to hold just the time frames for how long each meeting will be: 
var justTotalTime = [];
// Used to hold the room names for the rooms that the holder had booked: 
var justRoomNames = [];
// This global variable will be used to hold the related rooms to their prices within the invoices: 
var relatedRoomNames = [];
// This global variable will be used to hold the related times thier prices within the invoices: 
var relatedTotalTimes = []; 

//  extends React.Component

// This class does not display anything and should be used to check the current balance of the users. 
export default class InvoiceAuto {

    constructor() { 
        // Lobal variables: 
        this.title = "";
        this.value = ""; 
        this.posts = []; 
        // This is used to retrive all of the booking information which shows what holders are attached to each booking. 
        this.posts2 = []; 
        // This only pulls the small business names for a dynamic view of what businesses are added to the database: 
        this.justNames = []; 
        this.justEmail = []
        this.justCredits = [] 
        this.justPhone = [] 
        this.criteria = ""; 
        this.name = ""; 
        this.email = ""; 
        this.credits = ""; 
        this.phone = ""; 
        this.query = [];
        
        this.componentDidMount();
    }

    // state = {
    //     title: '',
    //     value: '', 
    //     posts: [],
    //     // This is used to retrive all of the booking information which shows what holders are attached to each booking. 
    //     posts2: [], 
    //     // This only pulls the small business names for a dynamic view of what businesses are added to the database: 
    //     justName: [],
    //     justEmail: [],
    //     justCredits: [], 
    //     justPhone: [], 
    //     criteria: '', 
    //     name: '',
    //     email: '', 
    //     credits: '', 
    //     phone: '',
    //     query: []
    //   };

    
    
// Returns just the names of the different rooms within the campus: 
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
  // The component will not mount now because it is no longer 
  // a REACT component. This function will have to be called by another
  // function: 
  componentDidMount(){  
    this.getBlogPost();
    this.getbookingpost();
    this.initiate();
  };
  // This gets all of the data from the booking_records collection
  getbookingpost = () => {
    axios.get('/api/booking')
      .then((response) => {
        const data = response.data;
        // this.setState({ posts2: data });
        this.posts2 = data; 
        console.log('Data has been received!!');
      })
      .catch(() => {
        alert('Error retrieving data!!!');
      });
  };
  
  // retrieves the posts from the /api route in the api.js file
  getBlogPost = () => { 
    axios.get('/api')
      .then((response) => { 
        const data = response.data;
        // this.setState({ posts: data });
        this.posts = data; 
        console.log("Data has been recieved!!");
      })
      .catch(() => { 
        alert('Error retrieving data!!');
      })
  }

  // Used to submit data to the database
  
  justCreditsFunc(posts, justCredits) { 
    posts.map((post, index) => ( 
      justCredits[index] = post.credits
    ));
    var options = []; 
    for (var i = 0; i < justCredits.length; i++) { 
      options[i] = { value: justCredits[i], label: justCredits[i] }
      
    }
    return options;
    
  }
  
justRoomNamesFunc (posts2) { 
    posts2.map((post, index) => (
        justRoomNames[index] = post.name
    ))
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
  var options = []; 
    options[0] = "";
    for (var i = 0; i < justNames.length; i++) { 
      options[i] = { value: justNames[i], label: justNames[i] }
      
    }
    return options
};
justHoldersFunc(posts2) { 

    posts2.map((post, index) => ( 
        justHolders[index] = post.holder
    ))
};
justTotalTimeFunc(posts2) { 
    posts2.map((post, index) => (
        justTotalTime[index] = post.totalTime
    ))
}
justCreditsFunc(posts1) { 
    posts1.map((post, index) => (
        justCredits[index] = post.credits
    ))
};

initiate() {
    // Finding the list of holders

    // This must be called to collect data from booking_records and user_credits collections:
    this.componentDidMount();
    this.justHoldersFunc(this.posts2);
    this.justNamesFunc(this.posts);

    // Next, we must see how many of these holders in the booking_records exist in the user_credits: 

    var refinedHolders = [] // This will be a list of the holders with no blank sections
    for (var i = 0; i < justHolders.length; i++) { 
        console.log("Entering for loop in initiat()...");
        if (justHolders !== "" || justHolders !== " " || justHolders !== null) { 
            console.log("Entering if statement in for loop...");
            refinedHolders[i] = justHolders[i]
        }
    }

    // Now we must remove duplicates in the list: 
    for (var i = 0; i < refinedHolders.length; i++) { 
        for (var j = 0; j < refinedHolders.length; j++) { 
            if (refinedHolders[i] === refinedHolders[j]) { 
                console.log("Removing duplicate...");
                refinedHolders.splice(j, 1); 
            }
        }
    }

    // This variable will be used to store the names of matches: 
    var matchedNames = []; 
    // This will be used as an iterator parse through the matchedNames array: 
    var k = 0; 
    // Outer loop iterates through the justNames array
    for (var i = 0; i < justNames.length; i++) { 
        // Inner loop iterates through the refinedHolders array
        for (var j = 0; j < refinedHolders.length; j++) {
            if (justNames[i] === refinedHolders[j]) { 
                console.log("We have found a match!");
                matchedNames[k] = justNames[i]; 
            }
        }
    }
    console.log("Here is the matchedNames list: " + matchedNames); 

    // Next, we must pull the rooms and the prices for each of those rooms that the users have booked: 

    // Getting all instances of room names within the booking_records collection: 
    this.justRoomNamesFunc(this.posts2);
    // Getting all instances of prices within the booking_records collection: 
    this.justPricesFunc(this.posts2);

    // Retrieving the size of the matchedNames array for looping purposes: 
    var max = matchedNames.length; 

    // This will be used to store the different array indicies where the matchedNames and 
    // justHolders were matched: 
    var counts = []; 
    var n = 0; // Used to iterate through counts

    for (var i = 0; i < max; i++) { 
        for (var j = 0; j < justHolders.length; i++) { 
            if (matchedNames[i] === justHolders[j]) { 

                // Collecting that array index
                counts[n] = j; 
                n++; 
            }
        }
    }

    console.log("Here are the active holders and their invoices: "); 
    for (var i = 0; i < matchedNames.length; i++) { 
        console.log("Username: " + matchedNames[i] + " booked room, " + justRoomNames[counts[i]] + " with a price of: " + justPrices[counts[i]]);
    }
}
}
