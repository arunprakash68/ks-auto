const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
// const passport = require('passport');
// const LdapStrategy = require('passport-ldapauth');
const path = require('path');
const http = require('http');
var request = require('request');

try {
    if(!process.env.APP_ENVIRONMENT || process.env.APP_ENVIRONMENT === 'local') {
        require('dotenv').config({path: './config/local.conf'});
    } else if(process.env.APP_ENVIRONMENT === 'prod') {
        require('dotenv').config({path: './config/prod.conf'});       
    } else if(process.env.APP_ENVIRONMENT === 'staging') {
        require('dotenv').config({path: './config/staging.conf'});
    } else {
        throw new Error('config file read error');
    }
} catch(e) {
    console.log(e);
    throw new Error('config file read error');
}

const app = express();


// API file for other APIs
const api = require('./server/routes/api');

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist')));



// API location
app.use('/api', api);



// app.use(passport.initialize());


app.post('/login', (req, res) => {
    try {
        var postParams = req.body;
        request({
            method: 'POST',
            url: process.env.assets_api + '/login',
            json: postParams,
            headers: {
                'Content-Type': 'application/json',
                'X-email': postParams.email,
                'X-password': postParams.password 
            }
        }, (error, response, body) => {
            console.log(error);
            res.json(body);
        });


    } catch(e){
        console.log(options);
        console.log(e);
    }
})


app.get('/health/status', (req, res) => {
    try {
        fs.readFile('check','utf8', function(error, data) {
            if(error) {
                console.log(error);
                res.json(error);
            }
            res.json(data);
        })
    }catch(e) {
        console.log(e);
    }
})

//Send all other /health requests an error message
app.get('/health/*', (req, res) => {
    res.status(404);
    res.send('Not found');
});

//Send all other get requests to the Angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// app.post('/login', function(req, res, next){
// 	// return res.send({user: true});
// 	var OPTIONS = {
// 	    server: {
// 	        // url: 'ldap://10.150.226.23:389', // local
// 	        url: 'ldap://172.29.101.52:389', // prod
// 	        bindDN: 'TimesGroup\\' + req.body.username,
// 	        bindCredentials: req.body.password,
// 	        searchBase: 'DC=timesgroup,DC=com',
// 	        searchFilter: '(sAMAccountName=' + req.body.username + ')',
// 	    }
// 	};

// 	passport.use(new LdapStrategy(OPTIONS));
// 	let userAuthenticated = passport.authenticate('ldapauth', function(error, user, info){
// 		if(error){
// 			return next(error);
// 		}
// 		if(!user){
// 			return res.send({user: null});
// 		}
// 		return res.send({user: user});
// 		// req.logIn(user, function(error){
// 		// 	if(error){
// 		// 		return next(error);
// 		// 	}
// 		// 	// return res.redirect('/dashboard');
// 		// 	return res.send({status: 'ok'});
// 		// })
// 	})(req, res, next);
// });



//Set Port
const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.timeout = 22000;

server.listen(port, () => console.log(`Running on localhost:${port}`));