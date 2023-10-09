





const express = require('express');
//const expressLayout = require('express-ejs-layouts')
const port = 5005 
const app = express();
const bodyParser = require('body-parser');

app.use(express.urlencoded({extended : true}));
app.use(express.json());

app.use(bodyParser.urlencoded({extended : true}));



//static files
app.use(express.static('public'));


//Templating engin
//app.use(expressLayout)
//app.set('layouts', '/layouts/main');
app.set('view engine', 'ejs')



//routes
app.use('/dashbord', require('./routes/dashbord'));
app.use('/users', require('./routes/users'));
// app.use('/marketplace', require('./routes/marketplace'));
app.use('/posts', require('./routes/posts'));
// app.use('/communities', require('./routes/communities'));




//start
app.listen(port, () => {
    console.log(`server sucessfull listen on port : http://localhost:${port} `)
});
