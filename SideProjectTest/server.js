// Import npm packages
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const config = require('config');

const app = express();
const PORT = process.env.PORT || 8080; 

const routes = require('./routes/api');

// the connection string can be pulled from MongoDB web client
// mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://tyler:1234@cluster0.t2bvb.mongodb.net/ccti_db?retryWrites=true&w=majority', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true
// });

// Getting DB URI from /config/keys.js
const db = config.get('mongoURI'); 
mongoose.connect(process.env.MONGODB_URI || db, {
    useNewUrlParser: true,
    useUnifiedTopology: true, 
    useCreateIndex: true
});

mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected!!!!');
});

mongoose.set('useFindAndModify', false);

// Data parsing (needed to be able to display documents)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        // Directs it to the html file
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    });
}


// HTTP request loggersss
app.use(morgan('tiny'));
app.use('/api', routes);




app.listen(PORT, console.log(`Server is starting at ${PORT}`));