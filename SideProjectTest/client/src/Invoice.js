import React from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import {BrowserRouter as Router} from 'react-router-dom';
import swal from 'sweetalert';
import CompanyLogo from './Logo2.png';
import InvoiceAuto from './invoiceAuto';

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

const styleObj = { 
  color: "white"
}

class Invoice extends React.Component {

    state = {
        title: '',
        value: '', 
        posts: [],
        // This is used to retrive all of the booking information which shows what holders are attached to each booking. 
        posts2: [], 
        // This only pulls the small business names for a dynamic view of what businesses are added to the database: 
        justName: [],
        justEmail: [],
        justCredits: [], 
        justPhone: [], 
        criteria: '', 
        name: '',
        email: '', 
        credits: '',  
        phone: '',
        query: []
      };

//imported from Schema and saved as strings so you can view in Web App console to see the inputs being stored; also used for Payload//
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

  componentDidMount = () => {  
    this.getBlogPost();
    // set the value to equal the name of the logged in user
    const name = localStorage.getItem("name"); 
    this.setState({ value: name })
    this.getbookingpost();
  }

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
  handleChange1 = ({ target }) => { 
    const { name, value } = target;
    this.setState({ [name]: value })
    this.resertUserInputs()
  };

  handleChange = ({ target }) => { 
    const { name, value } = target;
    this.setState({ [name]: value })
    
  };
  // retrieves the posts from the /api route in the api.js file
  getBlogPost = () => { 
    axios.get('/api')
      .then((response) => { 
        const data = response.data;
        this.setState({ posts: data });
        console.log("Data has been recieved!!");
      })
      .catch(() => { 
        alert('Error retrieving data!!');
      })
  }

  // Used to submit data to the database
  submit = (event) => {
    event.preventDefault();

    const payload = {
      name: this.state.name,
      email: this.state.email,
      phone: this.state.phone, 
      credits: this.state.credits,
    };

    axios({
      url: '/api/save',
      method: 'POST',
      data: payload
    })
      .then(() => {
        console.log('Data has been sent to the server');
        this.resertUserInputs();
        this.getBlogPost();
      })
      .catch(() => {
        console.log('Internal server error');
      });
  }

  displayBlogPost = (posts) => { 
    if (!posts.length) return null; 

    return posts.map((post, index) => ( 
      <div key={index} className=' t_display'>
        <h3>{post.name}</h3>
        <p>{post.body}</p>
      </div>
      
    ));
  };

  displayTitles(posts) { 
    if (!posts.length) return null; 

    return posts.map((post, index) => ( 
      <div className=' t_display'>
        <options>{post.name}</options>
      </div>
    ));
  };

  resertUserInputs = () => {
    this.setState({
      value: ''
    });
  };

  justEmail = (posts, justEmail) => { 
    posts.map((post, index) => ( 
      justEmail[index] = post.email
    ));
    var options = []; 
    for (var i = 0; i < justEmail.length; i++) { 
      options[i] = { value: justEmail[i], label: justEmail[i] }
      
    }
    return options
    
  };
  justCredits = (posts, justCredits) => { 
    posts.map((post, index) => ( 
      justCredits[index] = post.credits
    ));
    var options = []; 
    for (var i = 0; i < justCredits.length; i++) { 
      options[i] = { value: justCredits[i], label: justCredits[i] }
      
    }
    return options
    
  };
  justPhone = (posts, justPhone) => { 
    posts.map((post, index) => ( 
      justPhone[index] = post.phone
    ));
    var options = []; 
    for (var i = 0; i < justPhone.length; i++) { 
      options[i] = { value: justPhone[i], label: justPhone[i] }
      
    }
    return options
    
  };
  
  displayBusiness(counts, creditsUser) { 
    return  creditsUser.map((index) => (
      <li>{index}</li>
    ))
  
  };
  
  displayQuery(state, posts, posts2) {
    // This array holds the numberous indicies where the value matches the holder name in the 
    // booking_records collection: vv
    var counts = []; 
    this.justHoldersFunc(posts2);  
    var j = 0;
    for (var i = 0; i < justHolders.length; i++) {
        // This is an iterator that that adds to the count array: 
        
        if (state.value === justHolders[i]) { 
            counts[j] = i; 
            j++; 
        }
    }
    this.justPricesFunc(this.state.posts2); 
    this.justRoomNames(this.state.posts2);
    this.justTotalTimeFunc(this.state.posts2);
    // We need to find the max number of hits in the array so that we can itereate within that range
    var max = 0; 
    max = counts.length;
    var relatedPricing = [];
    for (var i = 0; i < max; i++) { 
        relatedPricing[i] = justPrices[counts[i]]
    }
    for (var i = 0; i < max; i++) { 
        relatedRoomNames[i] = justRoomNames[counts[i]]
    }
    for (var i = 0; i < max; i++) { 
        relatedTotalTimes[i] = justTotalTime[counts[i]]
    }
    console.log("This is relatedPricing: " + relatedPricing);
    console.log("This is relatedRoomNames: " + relatedRoomNames);
    
    return (
        relatedPricing.map((index) => (
            <li>{index}</li>
        )) 
        
    )

  } 
  justRoomNames(posts2) { 
    posts2.map((post, index) => (
        justRoomNames[index] = post.name
    ))
  }
  fieldDropdown = (criteria) => { 
    if (criteria === "") {
      console.log(criteria)
      console.log("No fields selected")
      return ( 
          <option>None</option>
      ) 
    }
    else if (criteria === "Holder Name") { 
      return (
          this.justHoldersFunc(this.state.posts2).map((option) => (
            <option value={option.value}>{option.label}</option>
          ))
      )
    }
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
    var options = []; 
    options[0] = "";
    for (var i = 0; i < justHolders.length; i++) { 
      options[i] = { value: justHolders[i], label: justHolders[i] }
      
    }
    return options
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

displayingRelatedRooms() { 
    var counts = []; 
    var relatedRoomNames = []; 
    var j = 0;
    this.justHoldersFunc(this.state.posts2)
    for (var i = 0; i < justHolders.length; i++) {
        // This is an iterator that that adds to the count array: 
        
        if (this.state.value === justHolders[i]) { 
            counts[j] = i; 
            j++; 
        }
    }
    this.justRoomNames(this.state.posts2);
    var max = 0; 
    max = counts.length;
    for (var i = 0; i < max; i++) { 
        relatedRoomNames[i] = justRoomNames[counts[i]]
    }
    return relatedRoomNames.map((index) => (
        <li>{index}</li> 
    ))
}
displayRelatedTimes() {
    var counts = []; 
    var relatedTotalTimes = []; 
    var j = 0;
    this.justHoldersFunc(this.state.posts2)
    for (var i = 0; i < justHolders.length; i++) {
        // This is an iterator that that adds to the count array: 
        
        if (this.state.value === justHolders[i]) { 
            counts[j] = i; 
            j++; 
        }
    }
    this.justTotalTimeFunc(this.state.posts2);
    var max = 0; 
    max = counts.length;
    
    for (var k = 0; k < max; k++) { 
        relatedTotalTimes[k] = justTotalTime[counts[k]]
        
    }
    return relatedTotalTimes.map((index) => (
        <li>{index}</li>
    ))
}
// This is used to gather the output for all of the functions at once: 
justGetItAll() {
this.justCreditsFunc(this.state.posts1); 
this.justHoldersFunc(this.state.posts2);
this.justNamesFunc(this.state.posts1);
this.justPricesFunc(this.state.posts2);

};

  render() {

    console.log('State: ', this.state);
    //JSX
    return(
      <div className="formContainer">
        <div className="app">
        <h1 className="search1" style={styleObj}>Booking History</h1>
        <br></br>
        <br></br>
        <br></br>
      <div id="queryResults">
        <h3 className="search2">Past Bookings: </h3>
        <br></br>
        <section className="ulclass">
        <table>
            <tr>
                <th>Pricing</th>
                <th>Room</th>
                <th>Total Time</th>
            </tr>
        </table>
        <tr>
            <td>{this.displayQuery(this.state, this.state.posts, this.state.posts2)}</td>
            <td>{this.displayingRelatedRooms(relatedRoomNames)}</td>
            <td>{this.displayRelatedTimes()}</td>
        </tr>
        </section>
       
      </div>
      <br></br>
              <img className="photo" src={CompanyLogo}/>

        </div>
      </div>

      
    );
  }
 
}

export default Invoice;