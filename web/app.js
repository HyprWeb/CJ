const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const cjRouter = require('./routes/api/cj');
const mlmRouter = require('./routes/api/mlm');
const bodyParser = require('body-parser');

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(cors());

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
  
    // Request methods you wish to allow
    //res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
   
    // Pass to next layer of middleware
    next();
});
// Mongo Client
require('./config/mongoDbConfig');
require('./shared/variables');

// Routers
app.use('/', cjRouter);
app.use('/', mlmRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running at: ${port}`);
});

app.get('/', (req, res) => {
  res.send('Dockerized CJ Application');
})

module.exports = app;