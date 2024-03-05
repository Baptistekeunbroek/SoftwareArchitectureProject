const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const paymentController = require('./controllers/paymentController');


// Import required modules



// Create an instance of the Express application
const app = express();

// Use middleware
app.use(bodyParser.json());
app.use(cors());

// Register routes and controllers
app.use('/route1', paymentController);


// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
