const express = require('express');

const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');

app.use(expressLayouts);

app.use('/', require('./routes/index'));


app.set('view engine', 'ejs');
app.set('views', './views');


app.listen(port, function(err){
    if(err){
        console.log(`Error occurred while running server : ${err}`);
        return;
    }
    console.log(`Server is up and running on port : ${port}`);
})