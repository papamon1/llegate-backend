const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

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




app.use('/api/v1/advertisings', advertisingsRoutes);
app.use('/api/v1/posts', postsRoutes);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});