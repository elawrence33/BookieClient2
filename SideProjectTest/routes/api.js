const express = require('express');
const router = express.Router();
const blogpost = require('../models/blogpost');
const bookingpost = require('../models/billing');
const users = require('../models/user');
const config = require('config');
const jwt = require('jsonwebtoken');
// Imported to encrypt messages to the database: 
const bcrypt = require('bcryptjs');
// Imported to require authentication to use routes: 
const auth = require('../middleware/auth');
const nodemailer = require("nodemailer"); 


// Routes used to either get data or post data from(to) MongoDB//

//this route pulls all information from MongoDB, commented out console that display it on server side//
router.get('/', (req, res) => {

    blogpost.find({  })
        .then((data) => {
            //console.log('Data: ', data);//
            res.json(data);
        })
        .catch((error) => {
            console.log('error: ', error);
        });
    
});
router.get('/booking', (req, res) => { 

    bookingpost.find({ })
        .then((data) => { 
            res.json(data);
            
        })
        .catch((error) => { 
            console.log('error: ', error);
        
        });
});

//.post is used to post the payload to the MongoDB 
router.post('/save', (req, res) => {
    const data = req.body;

        const newblogpost = new blogpost(data);

        newblogpost.save((error) => {
            if (error){
                res.status(500).json({msg: 'Sorry Internal Server Error'});
                return;
            }else
            return res.json({
                msg:('Your data has been saved to the database')
            });
        })
    });


router.put('/update', (req, res) => { 
    const Body = req.body
    const Name = Body.name
    const NewCreds = Body.credits
    const filter = { name: Name }
    const update = { credits: NewCreds }

    try { 
        // This is our second attempt using the findOneAndUpdate function. This make it where we do
        // not need to find the ID field. 
        blogpost.findOneAndUpdate(filter, update)
        .then((data) => {
            console.log('Debug statement => Data: ', data);
            res.json(data);
        })
        .catch((error) => {
            console.log('error: ', error);
        });
    } catch (err) { 
        console.log(err)
    }
    res.send('Updated!');
});

// This route is used to delete the entire entry: 
router.delete('/delete', (req, res) => {
    const Business = req.body.smallBusiness
    console.log("We have made it in the delete route");
    try { 
        console.log('We made it in the try block.');
        blogpost.findOneAndDelete({ smallBusiness: {Business} }); 
    } catch (err) { 
        
        console.log(err)
    }
    res.send('Deleted');
});
router.post('/Auth', (req, res) => {
    const { name, email, password } = req.body; 
    var Token;

    // Simple validation
    if (!name || !email || !password) { 
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    // Check for existing user: 
    users.findOne({ email }) // We are looking for an email that equals the email, since they are the same we only need one
        .then(user => { 
            console.log("Here is the user: " + user); 
            if (!user) return res.status(400).json({ msg: 'User does not exist'});
            
            // Validate password: 
            // We can use the compare method in the bycrypt class
            bcrypt.compare(password, user.password)
                .then(isMatch => { 
                    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials'}); 

                    jwt.sign(
                        { id: user.id }, 
                        config.get('jwtSecret'), 
                        { expiresIn: 3600 }, 
                        (err, token) => { 
                            if (err) throw err; 
                            res.json({
                             token,
                             user: { 
                                 id: user.id, 
                                 name: user.name, 
                                 email: user.email
                             }
                         });
                        
                         
                        }
                     )
                })

        })
    
});

router.put('/update-auth', (req, res) => { 
    const { email, password } = req.body; 
    var newPass = req.body.password;
    const filter = {email: email}; 
    

    // Simple validation
    if (!email || !password) { 
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    // Check for existing user: 
    users.findOne({ email }) // We are looking for an email that equals the email, since they are the same we only need one
        .then(user => { 
            if (!user) return res.status(400).json({ msg: 'User does not exist'});
        });

            bcrypt.genSalt(10, (err, salt) => { 
                bcrypt.hash(newPass, salt, (err, hash) => { 
                   if (err) throw err;
                    
                    // Updating the new password with the hashed version:
                    newPass = hash; 
                    const update = newPass;
                    users.updateOne(filter, {$set: {password: update }})
                    .then((data) => {
                        // We need to re-issue a token to the user:
                        users.findOne({ email })
                        .then(user => {
                            if (!user) return res.status(400).json({ msg: 'User does not exist'});
                            jwt.sign(
                                { id: user.id }, 
                                config.get('jwtSecret'), 
                                { expiresIn: 3600 }, 
                                (err, token) => { 
                                    if (err) throw err; 
                                    res.json({
                                    token,
                                    user: { 
                                        id: user.id, 
                                        name: user.name, 
                                        email: user.email
                                    }
                                    });
                                }
                            )
                        })
                        // res.json(data);
                    })
                    .catch((error) => {
                        return res.status(500).json({ msg: 'Could not update, need a valid account!'})
                    });
                });
            });
            
});
// Used to get one account and it's info:
router.get('/get-OneCreditUser', (req, res) => {
    // Getting the search criteria: 
    const query = req.params;
    console.log("This is the parameter name: " + req.params); 
    // The blogpost model is used for the user_credits collection: 
    blogpost.findOne({ query }) 
    .then(user => { 
        console.log("Here is the user in get-OneCreditUser: " + user); 
        res.json(user); 
    })
    .catch((error) => { 
        return res.status(500).json({ msg: "Could not find user in the database!"}); 
    })

});

router.post('/post-OneCreditUser', (req, res) => {
    // Getting the search criteria: 
    const query = req.body.name;
    console.log("This is the parameter name: " + query); 
    // The blogpost model is used for the user_credits collection: 
    blogpost.findOne({ name: query }) 
    .then(user => { 
        console.log("Here is the user in get-OneCreditUser: " + user); 
        res.json(user); 
    })
    .catch((error) => { 
        return res.status(500).json({ msg: "Could not find user in the database!"}); 
    })

});
router.put('/update-credits', (req, res) => { 
    // Creating transporter object to deliver email: 
    const transporter = nodemailer.createTransport({ 
        host: 'smtp.gmail.com',
        // Prt 587 is a TCP port used for the smtp service:
        port: 587, 
        auth: { 
            user: 'jonnyappleseed336@gmail.com', 
            pass: 'j0nny4pp13'
        }
    })

    const update = req.body.newCreds; 
    const name = req.body.name;
    const message = req.body.message;
    const email = req.body.email; 
    // Setting filter to equal the name selected from the front-end
    const filter = {name: name}; 

    blogpost.updateOne(filter, {$set: { credits: update }})
    .then((data) => {
        // If successful then respond with the data
        res.json(data);

        // Using the tranporter object to use an asynchronous method for email sending: 
        if (email != null) {
            transporter.sendMail({
                from: 'jonnyappleseed336@gmail.com', 
                to: email,
                subject: 'You account has been refunded!',
                text: message
            })
        } else { 
            console.log("Credits where changed but no confirmation message could be sent. Holder does not have an email connected to their account!"); 
        }
    })
    .catch(() => { 
        res.status(500).json({ msg: "Could not refund credits" }); 
    })
    
});



module.exports = router;