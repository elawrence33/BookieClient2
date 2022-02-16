import React from 'react'; 
import axios from 'axios';
import swal from 'sweetalert';
import Swal from 'sweetalert2';
import CompanyLogo from './Logo2.png';

class Account extends React.Component { 
    state = { 
        name: "", 
        email: "", 
        user: ""
    }

    componentDidMount = () => {
        // On mount we get the credit user immediately: 
        this.getAccount();
        // this.getCreditUser(); 
        // Setting delay so that state will be updated before function is called: 
        setTimeout(() => { this.getCreditUser(); }, 500); 
    }

    getCreditUser = () => {
        // Setting the payload as the name as the get-OneCreditUser 
        // will need

        const payload = { 
            name: this.state.name
        }
        console.log("This is the state.name in the gerCreditUser(): " + this.state.name);

        // axios.get('/api/get-OneCreditUser', { 
        //     params: {
        //         name: this.state.name
        //     }})
        // .then((response) => { 
        //     const data = response.data; 
        //     this.setState({ user: data });
        //     swal('Successfully accessed the credit user!', { 
        //         className: "green-bg"
        //     })
        // })
        // .catch(() => { 
        //     swal('Could not get the user from the Database!', { 
        //         className: "red-bg"
        //     })
        //     console.log('Internal server error'); 
        // });

        axios({
            url: '/api/post-OneCreditUser',
            method: 'POST',
            data: payload
        })
          .then((response) => {
            const data = response.data;
            this.setState({ user: data });
            console.log('Successfully accessed the credit user!');
          })
          .catch(() => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Imformation could not be sent to the database.',
                backdrop: 'rgba(203, 203, 203, 0.2)'
            }) 
            console.log('Could not get the user from the Database!')
            console.log('Internal server error');
          });;    
    }

    // Getting account info from session storage: 
    getAccount = () => { 
        // Getting account infro from local storage. The items stored in local
        // storage orginiates from the login.js file. 
        const name = localStorage.getItem("name"); 
        const email = localStorage.getItem("email"); 
        console.log("Here is our name and email from localStorage: " + name + " " + email); 
        // Now setting state to equal these values: 
        this.setState({ name: name }); 
        this.setState({ email: email }); 
    }
    // Displaying the results of the account lookup: 
    displayQuery = () => {
        const user = JSON.stringify(this.state.user); 
        const name = this.state.user.name; 
        const email = this.state.user.email; 
        const phone = this.state.user.phone; 
        const credits = this.state.user.credits; 

        return ( 
            <div>
                <h2 className="searchcomp">Holder Name</h2> 
                <p>{name}</p>
                <h2 className="searchcomp">Email:</h2>
                <p>{email}</p>
                <h2 className="searchcomp">Phone: </h2>
                <p>{phone}</p>
                <h2 className="searchcomp">Credits: </h2>
                <p>{credits}</p>          
            </div>
        )
    }

    render() {
        console.log("Here is our user in the state: " + JSON.stringify(this.state.user)); 
        
        return(
            <div className="formContainer">
                <div> 
                    <h1 className="search1">Account Information</h1>

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
      
        )
    }
}

// Must export the class or it will not be accesible outside the class. 
export default Account; 