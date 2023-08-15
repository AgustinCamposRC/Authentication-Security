require('dotenv').config

const express = require('express')
const ejs = require('ejs')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const md5 = require('md5')


/* Db connection */
dbConnection().catch( err => console.log(err))
async function dbConnection() {
    await mongoose.connect("mongodb://127.0.0.1:27017/authDB");
};

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


const User  = mongoose.model('User', userSchema);


const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));


app.get('/', (req, res) => {
    res.render('home');
});


app.route('/register')
    .get((req, res) => {
        res.render('register');
    })
    .post((req, res) => {
        const newUser = new User({
            email: req.body.email,
            password: md5(req.body.password)
        });
        newUser.save()
            .then(res.render('secrets'))
            .catch( err => console.log(err) );
    });

app.route('/login')
    .get((req, res) => {
        res.render('login');
    })

    .post((req, res) => {
        User.findOne({email: req.body.email})
            .then(userFound => {
            
                if (userFound.password === md5(req.body.password)) {
                    res.render('secrets');
                }
            })
            .catch( err => console.log(err) );
    });

app.listen(3000, () => console.log('Running on port 3000.'))