import React from 'react';
import axios from 'axios';

// This was an important Select component that looked nicer but was unable to pull data from it: 
// import Select from "react-dropdown-select";

import './App.css';
import CompanyLogo from './Logo2.png'


const criteriaOptions = [
  {value: "None", label: "None"}, 
  {value: "User Name", label: "User Name"}, 
]

const styleObj = { 
  color: "black"
}

class Search extends React.Component {


  state = {
    title: '',
    value: '', 
    posts: [],
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

  
  
// This function will dynamically add the group titles to the dropdown menu so that when new groups are added that will
// pupulate in the dopdown. This is achieved by passing the posts array and an array with just titles into the function
// and returning the individual titles to the option array. Finally we simply pass this to the option array and return it
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
  
  displayQuery(state, posts) {  
    // This will denote where in the database the rest of the data should be pulled
    var count; 
    // This will be used to hold more than one index for columns that have duplicates like MOU, NDA, and IP
    var counts = [];
    // This holds the Business Names that correspond to the MOU slected
    var emailUser = []
    var phoneUser = []
    var creditsUser = []
    const tempUser = []
    const tempPhone = []
    const tempEmail = []
    const tempCredits = []
  

    posts.map((post, index) => ( 
      tempUser[index] = post.name
    ))
    posts.map((post, index) => ( 
      tempPhone[index] = post.phone
    ))
    posts.map((post, index) => ( 
      tempEmail[index] = post.email
    ))
    posts.map((post, index) => ( 
      tempCredits[index] = post.credits
    ))


    if (state.criteria === "") { 
      return null; 
    }
    else if (state.criteria === "User Name") { 
      for (var i = 0; i < tempUser.length; i++) {
        if (tempUser[i] === state.value) {
          count = i; 
        }
      }
      return (
        <div>
          <h2 className="searchcomp">{state.criteria}</h2> 
          <p>{state.value}</p>
          <h2 className="searchcomp">Email </h2>
          <p>{tempEmail[count]}</p>
          <h2 className="searchcomp">Phone: </h2>
          <p>{tempPhone[count]}</p>
          <h2 className="searchcomp">Credits: </h2>
          <p>{tempCredits[count]}</p>          
        </div>
      )
    }
    else if (state.criteria === "Phone") { 
      for (i = 0; i < tempPhone.length; i++) {
        if (tempPhone[i] === state.value) {
          emailUser[i] = tempUser[i]
          counts = tempPhone[i]
        }
      }
      
      return ( 
        <div>
          <h2 className="searchcomp">User Name: </h2>
          <ul className=" t__display">{this.displayBusiness(counts, phoneUser)}</ul>
          <h2>{state.criteria}: </h2>
          <p>{state.value}</p>
        
        </div>
      )
    }
    else if (state.criteria === "Email:") { 
      for (i = 0; i < tempEmail.length; i++) {
        if (tempEmail[i] === state.value) {
          emailUser[i] = tempUser[i]
          counts = tempEmail[i]
        }
      }
      return (
        <div> 
          <h2 className="searchcomp">User Names: </h2>
          <ul className=" t__display">{this.displayBusiness(counts, emailUser)}</ul>
          <h2>{state.criteria}</h2>
          <p>{state.value}</p>
          
        </div>
      )
    }
    else if (state.criteria === "Credits") {
      for (i = 0; i < tempCredits.length; i++) {
        if (tempCredits[i] === state.value) {
          creditsUser[i] = tempUser[i]
          counts = tempCredits[i]
        }
      }
      return ( 
        <div>
          <h2 className="searchcomp">User Names: </h2>
          <ul className=" t__display">{this.displayBusiness(counts, creditsUser)}</ul>
          <h2>{state.criteria}</h2>
          <p>{state.value}</p>
        </div>
      )
    } 
  }
 
  fieldDropdown = (criteria) => { 
    if (criteria === "") {
      console.log(criteria)
      console.log("No fields selected")
      return ( 
          <option>None</option>
      ) 
    }
    else if (criteria === "User Name") { 
      return (
          this.titles(this.state.posts, this.state.justName).map((option) => (
            <option value={option.value}>{option.label}</option>
          ))
      )
    }
  }

  render() {

    //JSX
    return(
      <div className="formContainer">
        <div className="app">
        <h1 className="search1" style={styleObj}>Search by Users for information</h1>
        <br></br>
        <br></br>

        
        <form>
          <h2 className="search1">Select a Criteria:</h2>
          <div className="dropdown">
            <select value={this.state.criteria} name="criteria" onChange={this.handleChange1}>
              {criteriaOptions.map((option) => (
                <option value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <h2 className="search1">Select User: </h2>

          <select value={this.state.value} name="value" onChange={this.handleChange}>
            {this.fieldDropdown(this.state.criteria)}
          </select> 
          <p></p>

        </form>
<br></br>
      <div id="queryResults">
        <h3 className="search2">User Information: </h3>
        <br></br>
        <ul className="ulclass">
          {this.displayQuery(this.state, this.state.posts)}

        </ul>
      </div>
      <br></br>
              <img className="photo" src={CompanyLogo}/>

        </div>
      </div>

      
    );
  }
}

export default Search;