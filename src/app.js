const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors")
const bcrypt = require('bcrypt')

// requiring and using dotenv
require("dotenv").config();
//database connection 
require('./mongoose/db/mongoose')

const tokens = require('./utilities/auth/tokens')



//routers 
const userRout = require('./routes/userRout')
const authRout = require('./routes/authRout')
const quoteRout = require('./routes/quoteRout')
const notFoundPage = require('./routes/common')
const publicQuoteRout = require('./routes/PublicQuoteRout')
const app = express();

// Express body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// For Static files 
app.use(express.static("public"));


//using Routs
app.use('/api/users', userRout)
app.use('/api/users', authRout)
app.use('/api/quotes', quoteRout)
app.use(publicQuoteRout)


app.use(notFoundPage)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`listening at ${PORT}`));
