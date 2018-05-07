const express = require('express');
const router = express.Router();
var request = require('request');
const httpRequestPromise = require('../../custom-request-promise');


// Get pool summary (sgsummary)
router.get('/sgsummary', (req, res) => {
    try {
        const getParams = req.query;
        var qs = { 
            's_count': getParams['s_count'],
            'e_count': getParams['e_count'],
            'bu': getParams['bu'] ? getParams['bu'] : '',
            'project': getParams['project'] ? getParams['project'] : '',
            'env': getParams['env'] ? getParams['env'] : '',
            'zone': getParams['zone'] ? getParams['zone'] : ''
        };
        const options = {
            baseUrl: process.env.auto_api,
            uri: '/api/v0.1/sgsummary',
            qs,
            method: 'GET',
            json: true,
            headers: {
                'Content-Type': 'application/json',
                'X-Email': req.get('X-Email'),
                'X-Token': req.get('X-Token')
            }
        }
        
        httpRequestPromise.resolveHTTPRequestPromise(options, req, res);

    } catch(e){
        console.log(options);
        console.log(e);
    }
});


// get pool members list
router.get('/sgmembers', (req, res) => {
    try {
        const getParams = req.query;
        var qs = { 
            'poolname': getParams['poolname'] ? getParams['poolname'] : '',
            'zone': getParams['zone'] ? getParams['zone'] : ''
        };
        const options = {
            baseUrl: process.env.auto_api,
            uri: '/api/v0.1/sgmembers',
            qs,
            method: 'GET',
            json: true,
            headers: {
                'Content-Type': 'application/json',
                'X-Email': req.get('X-Email'),
                'X-Token': req.get('X-Token'),
                'X-Location': getParams['location'] ? getParams['location'] : ''
            }
        }
        
        httpRequestPromise.resolveHTTPRequestPromise(options, req, res);

    } catch(e){
        console.log(options);
        console.log(e);
    }
})


//add member in pool
router.post('/sgmembers', (req, res) => {
    try {
        let postParams = req.body;
        request({
            method: 'POST',
            url: process.env.auto_api + '/api/v0.1/sgmembers',
            json: {
                port: (postParams['port'] ? postParams['port'] : ''),
                poolname: (postParams['poolname'] ? postParams['poolname'] : ''),
                zone: (postParams['zone'] ? postParams['zone'] : ''),
                serverip: (postParams['serverip'] ? postParams['serverip'] : '')
            },
            headers: {
                'X-Email': req.get('X-Email'),
                'X-Token': req.get('X-Token'),
                'X-Location': (postParams['location'] ? postParams['location'] : '')
            }
        }, (error, response, body) => {
            console.log(error);
            // console.log(response);
            res.json(body);
        });


    } catch(e){
        console.log(options);
        console.log(e);
    }
})

// get pool members list
router.post('/serviceaction', (req, res) => {
    try {
        const postParams = req.body;
        var json = { 
            'poolname': postParams['poolname'] ? postParams['poolname'] : '',
            'zone': postParams['zone'] ? postParams['zone'] : '',
            'action':postParams['action'] ? postParams['action'] : '',
            'port': postParams['port'] ? postParams['port'] : '',
            'serverip':postParams['serverip'] ? postParams['serverip'] : '',
        };
        const options = {
            baseUrl: process.env.auto_api,
            uri: '/api/v0.1/serviceaction',
            method: 'POST',
            json,
            headers: {
                'Content-Type': 'application/json',
                'X-Email': req.get('X-Email'),
                'X-Token': req.get('X-Token'),
                'X-Location': postParams['location'] ? postParams['location'] : ''
            }
        }
        
        httpRequestPromise.resolveHTTPRequestPromise(options, req, res);

    } catch(e){
        console.log(options);
        console.log(e);
    }
})

// delete pool member
router.delete('/sgmembers', (req, res) => {

    try {
        let deleteParams = req.query;
        request({
            method: 'DELETE',
            url: process.env.auto_api + '/api/v0.1/sgmembers',
            json: {
                port: (deleteParams['port'] ? deleteParams['port'] : ''),
                poolname: (deleteParams['poolname'] ? deleteParams['poolname'] : ''),
                zone: (deleteParams['zone'] ? deleteParams['zone'] : ''),
                serverip: (deleteParams['serverip'] ? deleteParams['serverip'] : '')
            },
            headers: {
                'X-Email': req.get('X-Email'),
                'X-Token': req.get('X-Token'),
                'X-Location': (deleteParams['location'] ? deleteParams['location'] : '')
            }
        }, (error, response, body) => {
            console.log(error);
            // console.log(response);
            res.json(body);
        });


    } catch(e){
        console.log(options);
        console.log(e);
    }
})

module.exports = router;