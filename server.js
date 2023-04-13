/**
 * @author Shubham Shukla <shuklas506@gmail.com>
 * @description MAILBOX HANDLER SERVER
 */

require("dotenv").config() // load data from env to process.env
const express = require('express');
require('express-async-errors');
const app = express();
const route = require("./src/routes/route");
const mongoose = require("mongoose")



// Global Middleware
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}));

// Establish connection with mongoose and creating new Database
mongoose.connect(`mongodb+srv://${process.env.API_MONGO_USERNAME}:${process.env.API_MONGO_PASSWORD}@cluster0.azzwg.mongodb.net/socialmedia?retryWrites=true&w=majority`, {
        useNewUrlParser: true
    })
    .then(() => console.log("Mongodb is connected"))
    .catch(err => console.log(err))


app.use("/api", route)

app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).send('Something went wrong!')
});


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
})