import React from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import {BrowserRouter as Router} from 'react-router-dom';
import swal from 'sweetalert';

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


class Update extends React.Component {

  //message that info has been sent, need to reconfigure incase the entry is a duplicate.
onButtonCLickHandler = () => {
  

}
//imported from Schema and saved as strings so you can view in Web App console to see the inputs being stored; also used for Payload//
  state = { 
    smallBusiness: '',
    address: '',
    website: '',
    companyTech: '',
    poc: '',
    emailinfo: '',
    phoneinfo:'',
    titleSTTR:'',
    descripSTTR: '',
    princInv: '',
    businessSplit: '',
    cctiSplit: '',
    cctiprovide: '',
    mou: '',
    nda: '',
    ipADD: '',
    cycleSubmit: '',
    topicID: '',
    sttrID: '',
    phaseType: '',
    stateOfProject: '',
    display: [],
    // used to only show the business names within the database. This can be used for a dynamic dropdown list:
    justTitles: [],
    // used to grab all of the data from the database:
    posts: [], 
    // Used to hold the unique id that will be assigned automatically and randomly within MongoDB:
    id: ''
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
    this.matchNameToId(this.state.smallBusiness, this.state.posts);
    
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
    
//payload sent to Node.js to be posted in MongoDB//
    const payload = {
      smallBusiness: this.state.smallBusiness, 
      address: this.state.address, 
      website: this.state.website, 
      companyTech: this.state.companyTech,
      poc: this.state.poc,
      emailinfo: this.state.emailinfo,
      phoneinfo: this.state.phoneinfo,
      titleSTTR: this.state.titleSTTR,
      descripSTTR: this.state.descripSTTR,
      princInv: this.state.princInv,
      businessSplit: this.state.businessSplit, 
      cctiSplit: this.state.cctiSplit,
      cctiprovide: this.state.cctiprovide,
      mou: this.state.mou,
      nda: this.state.nda,
      ipADD: this.state.ipADD,
      cycleSubmit: this.state.cycleSubmit,
      topicID: this.state.topicID,
      sttrID: this.state.sttrID, 
      phaseType: this.state.phaseType,
      stateOfProject: this.state.project
  
    };

//estabishing connection to Node.js and MongoDB//
    axios({
        url: '/api/update',
        method: 'PUT',
        data: payload
    })
      .then(() => {
        console.log('Data has been sent to the server');
        this.resetUserInputs();
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
    // axios.put('/update', {
    //     id: payload.id,
    //     newBusiness: payload.smallBusiness,
    //     newAddress: payload.address,
    //     newWebsite: payload.website, 
    //     newCompanyTech: payload.companyTech,
    //     newPoc: payload.poc,
    //     newEmailInfo: payload.emailinfo,
    //     newPhoneInfo: payload.phoneinfo,
    //     newTitleSttr: payload.titleSTTR,
    //     newDescripSttr: payload.descripSTTR,
    //     newPrincInv: payload.princInv,
    //     newBusinessSplit: payload.businessSplit,
    //     newCctiSplit: payload.cctiSplit, 
    //     newCctiProvide: payload.cctiprovide,
    //     newMou: payload.mou,
    //     newNda: payload.nda,
    //     newIpAdd: payload.ipADD, 
    //     newCycleSubmit: payload.cycleSubmit, 
    //     newTopicID: payload.topicID,
    //     newSttrId: payload.sttrID,
    //     newPhaseType: payload.phaseType,
    //     newStateOfProject: payload.stateOfProject
        
    // });
    
  };

  resetUserInputs = () => {
    this.setState({
      smallBusiness: '',
      address: '',
      website: '',
      companyTech: '',
      poc: '',
      emailinfo: '',
      phoneinfo:'',
      titleSTTR:'',
      descripSTTR: '',
      princInv: '',
      businessSplit: '',
      cctiSplit: '',
      cctiprovide: '',
      mou: '',
      nda: '',
      ipADD: '',
      cycleSubmit: '',
      topicID: '',
      sttrID: '',
      phaseType: '',
      stateOfProject: '',
    });
  };
  titles = (posts, justTitles) => { 
    posts.map((post, index) => ( 
      justTitles[index] = post.smallBusiness
    ));
    var options = []; 
    options[0] = ""
    for (var i = 0; i < justTitles.length; i++) { 
      options[i] = { value: justTitles[i], label: justTitles[i] }
      
    }
    return options
    
  };
  displayTitles(state) { 
      return (
        this.titles(this.state.posts, this.state.justTitles).map((options) => (
            <option value={options.value}>{options.label}</option>
        ))
      )
  };
  render() {

    console.log('State: ', this.state);

    

    //JSX
    return(
 

    <div className="formContainer">
  
 
      {/* inputs for payload to be sent to DB */}
      <div className="app">
     
        <h1 className="header1">Update your Fields: </h1>
        <br></br>
        <form onSubmit={this.submit}>
         {/* input text box's for needed payload */}
          <div className="form-input"> 
            <h3>First Select Business Name:</h3>
            <select value={this.state.smallBusiness} name="smallBusiness" onChange={this.handleChangeID}>
                {this.displayTitles(this.state)}
            </select>
          </div>
  
          <div className="form-input">
            <input 
              type="text"
              name="address"
              placeholder="Enter Address"
              value={this.state.address}
              onChange={this.handleChange}
            />
          </div>
         
          <div className="form-input">
            <input 
              type="text"
              name="website"
              placeholder="Enter Website"
              value={this.state.website}
              onChange={this.handleChange}
            />
          </div>

          <div className="form-input">
            <textarea
              type="text"
              name="companyTech"
              placeholder="What Technology does the Company have"
              cols="25"
              rows="3"
              value={this.state.companyTech}
              onChange={this.handleChange}
            />
          </div>

          <div className="form-input">
            <input
              type="text"
              name="poc"
              placeholder="Company Point of Contact"
              value={this.state.poc}
              onChange={this.handleChange}
            />
          </div>

          <div className="form-input">
            <input 
              type="text"
              name="emailinfo"
              placeholder="Enter Contact Information (email)"
              value={this.state.emailinfo}
              onChange={this.handleChange}
            />
          </div>
          <div className="form-input">
            <input 
              type="text"
              name="phoneinfo"
              placeholder="Enter Contact Information (Phone)"
              value={this.state.phoneinfo}
              onChange={this.handleChange}
            />
          </div>

          <div className="form-input">
            <input 
              type="text"
              name="titleSTTR"
              placeholder="Enter the title of the STTR"
              value={this.state.titleSTTR}
              onChange={this.handleChange}
            />
          </div>

          <div className="form-input">
            <textarea
              placeholder="Enter the Description of the STTR"
              name="descripSTTR"
              cols="25"
              rows="3"
              value={this.state.descripSTTR}
              onChange={this.handleChange}
            >              
            </textarea>
          </div>

          <div className="form-input">
            <input 
              type="text"
              name="princInv"
              placeholder="Enter the Principal Investigator"
              value={this.state.princInv}
              onChange={this.handleChange}
            />
          </div>

          <div className="form-input">
            <input 
              type="number"
              name="businessSplit"
              placeholder="Enter in the Business Split"
              value={this.state.businessSplit}
              onChange={this.handleChange}
            />
          </div>

          <div className="form-input">
            <input 
              type="number"
              name="cctiSplit"
              placeholder="What is CCTI's Split"
              value={this.state.cctiSplit}
              onChange={this.handleChange}
            />
          </div>

          <div className="form-input">
            <input 
              type="text"
              name="cctiprovide"
              placeholder="What is CCTI providing"
              value={this.state.cctiprovide}
              onChange={this.handleChange}
            />
          </div>
         <div style={{clear:"left"}}>
<h3 className="formHeader" >Please Select Status</h3>


        <label style= {{marginLeft:"30%", color:"white"}}>Select Status of MOU</label>
          <div id= 'mou'>
          <div className="select-Container">
            <select name="mou" value={this.state.mou} onChange={this.handleChange}>
              {options.map((option) => (
                <option id= "mou" value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        <label style= {{marginLeft:"30%", color:"white"}}>Select Status of NDA</label>
        <div id= 'NDA'>
          <div className="select-Container">
            <select name="nda" value={this.state.nda} onChange={this.handleChange}>
              {options.map((option) => (
                <option id= "NDA" value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        <label style= {{marginLeft:"30%", color:"white"}}>Select Status of IP</label>
        <div id= 'ipADD'>
          <div className="select-Container">
            <select name="ipADD" value={this.state.ipADD} onChange={this.handleChange}>
              {options.map((option) => (
                <option id= "ipADD" value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
       
<br></br>
<label style= {{marginLeft:"30%", color:"white"}}>Date the cycle was submitted</label>
        <div className="form-input">
            <input 
              type="date"
              name="cycleSubmit"
              placeholder="Date the cycle was submitted"
              value={this.state.cycleSubmit}
              onChange={this.handleChange}
            />
          </div>

          <div className="form-input">
            <input 
              type="text"
              name="topicID"
              placeholder="Enter Topic ID"
              value={this.state.topicID}
              onChange={this.handleChange}
            />
          </div>
         
          <div className="form-input">
            <input 
              type="text"
              name="sttrID"
              placeholder="Enter STTR ID"
              value={this.state.sttrID}
              onChange={this.handleChange}
            />
          </div>
          <label style= {{marginLeft:"30%", color:"white"}}>Select Phase </label>
        <div id= 'phaseType'>
          <div className="select-Container">
            <select name="phaseType" value={this.state.phaseType} onChange={this.handleChange}>
              {options0.map((option) => (
                <option id= "phaseType" value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        <label style= {{marginLeft:"30%", color:"white"}}>Select State of the Project</label>
        <div id= 'stateOfProject'>
          <div className="select-Container">
            <select name="stateOfProject" value={this.state.stateOfProject} onChange={this.handleChange}>
              {options1.map((option) => (
                <option id= "stateOfProject" value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <br></br>
          </div>
        </div>
</div>
          <button onClick={this.onButtonCLickHandler}>Submit</button>
        </form>
        
      
</div>
   
      </div>
    
    
    );
  
  }
 
}





export default Update;