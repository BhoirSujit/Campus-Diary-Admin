const express = require('express');

const port = 5005
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

const admin = require('./config').admin
const db = require('./config')


//static files
app.use(express.static('public'));

//view engine
app.set('view engine', 'ejs')


//init session
app.use(session({
    secret: 'fdsjpfdojs9fdsudoshofsd980934k', 
    resave: false,
    saveUninitialized: true,
}));


function checkAuthentication(req, res, next) {
    const { username } = req.session;

    if (username) {
        return next();
    }
    res.redirect('/signin');
}


//sign up
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const adminRef = db.collection(`admin`).doc(`${email}`);
    adminRef.set({
        name: name,
        password: password,
        email: email
    });

    //logged
    req.session.username = email;
    res.redirect('/dashbord');
});

//login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const adminCollection = db.collection('admin');

    adminCollection.where('email', '==', email).get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                res.send('Login failed. User not found.');
                return;
            }

            querySnapshot.forEach((doc) => {
                const userData = doc.data();

                if (userData.password === password) {

                    //logged
                    req.session.username = email;
                    res.redirect('/dashbord');


                } else {
                    res.send('Login failed. Check your credentials.');
                }
            });
        })
        .catch((error) => {
            console.error('Error querying Firestore:', error);
            res.status(500).send('Internal server error');
        });
});

//logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
        }
        res.redirect('/signin');
    });
});


//routes
app.use('/signin', require('./routes/signin'));
app.use('/signup', require('./routes/signup'));
app.use('/', checkAuthentication, require('./routes/dashbord'));
app.use('/dashbord', checkAuthentication, require('./routes/dashbord'));
app.use('/users', checkAuthentication, require('./routes/users'));
app.use('/marketplace', checkAuthentication, require('./routes/marketplace'));
app.use('/posts', checkAuthentication, require('./routes/posts'));
app.use('/communities', checkAuthentication, require('./routes/communities'));
app.use('/feedback', checkAuthentication, require('./routes/feedback'));
app.use('/report', checkAuthentication, require('./routes/report'));





//start
app.listen(port, () => {
    console.log(`server sucessfull listen on port : http://localhost:${port} `)
});
