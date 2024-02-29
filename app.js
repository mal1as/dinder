const express = require('express');
const usersRouter = require("./routes/usersRouter");
const mainRouter = require("./routes/mainRouter");
const app = express();

const PORT = process.env.PORT || 80;

// view engine setup
app.set('view engine', 'ejs');

app.use(express.static(__dirname+'/public'));

app.use('/users', usersRouter);
app.use('/', mainRouter);

// for not found errors
app.use(function (request, response) {
    response.status(404).send("Not found");
});

app.listen(PORT, function () {
    console.log("Server was started...");
});





