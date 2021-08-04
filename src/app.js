const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors")
const bcrypt = require('bcrypt')

// requiring and using dotenv
require("dotenv").config();
//database connection 
require('./mongoose/db/mongoose')


//routers 
const userRout = require('./routes/userRout')

const app = express();

// Express body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// For Static files 
app.use(express.static("public"));


//using Routs
app.use('/api/users', userRout)



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`listening at ${PORT}`));
