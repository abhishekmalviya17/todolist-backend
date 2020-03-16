const express = require('express');

var cors = require('cors')

const app = express();

const mongoose = require('mongoose');

app.use(cors())

const bodyParser = require('body-parser');

const config = require('./config');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

// import routes
const authRoute = require('./routes/auth');
const eventsRoute = require('./routes/events');

//connect to DB
mongoose.connect(
        process.env.DB_CONNECT || config.DB_CONNECT,
        { useNewUrlParser: true,  useUnifiedTopology: true },
        () => console.log('Connected to DB'));

//Route middlewares
app.use('/api/user', authRoute);
app.use('/api/events', eventsRoute);
app.get('/',(req, res) => {
    res.send('You live only once');
})

let port = process.env.PORT || 4000;
console.log(port);
app.listen(port, () => { console.log("Up and running") });

 