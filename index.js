const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const server = require('http').createServer(app)    

// var corsOptions = {
//     origin: "http://localhost:8081"
//   };
  
// app.use(cors(corsOptions));

const advertisingsRoutes = require('./routes/advertisings.routes')
const postsRoutes = require('./routes/posts.routes')


// parse requests of content-type - application/json
// app.use(bodyParser.json());

// // parse requests of content-type - application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }));

// // simple route
// app.get("/", (req, res) => {
//     return res.status(200).json({ message: 'Welcome to Express API template' });
// });



app.use(bodyParser.json())
app.use('/api/v1/advertisings', advertisingsRoutes);
app.use('/api/v1/posts', postsRoutes);


server.listen('8080' , function() {
  console.log('App is running on port: ' + 8080);
});