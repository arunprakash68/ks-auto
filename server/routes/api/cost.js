const express = require('express');
const router = express.Router();
const httpRequest = require('../../custom-http-request');
const httpRequestPromise = require('../../custom-request-promise');
var request = require('request');

// Get list of my business and costs
router.get('/getprojectwisecost', (req, res) => {

    try {
        const getParams = req.query;
        const options = {
            baseUrl: process.env.assets_api,
            uri: '/v1/api/getprojectwisecost',
            qs: {
            'costtype': getParams['costtype'],
            'year': getParams['year'], 
            'start': getParams['start'], 
            'limit': getParams['limit'],
            'zone': (getParams['zone'] ? getParams['zone'] : ''),
            'bu_value': (getParams['bu_value']),
            'project_value': (getParams['project_value'] ? getParams['project_value'] : ''), 
            'month': getParams['month']
            },
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
})

// Get list of zone assets and costs
router.get('/getzoneassetlist', (req, res) => {

    try {
        const getParams = req.query;
        const options = {
            baseUrl: process.env.assets_api,
            uri: '/v1/api/getzoneassetlist',
            qs: {
            'start': getParams['start'], 
            'limit': getParams['limit'],
            'dc': getParams['dc'],
            'zone': getParams['zone'],
            'di_type': getParams['di_type'],
            'model': getParams['model'],
            'model_type': getParams['model_type'],
            },
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
})

// Get list of datacenter zones
router.get('/getdatacenterzone', (req, res) => {

    try {
        const getParams = req.query;
        const options = {
            baseUrl: process.env.assets_api,
            uri: '/v1/api/getdatacenterzone',
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
})

// Get list of DI types
router.get('/getstoragelist', (req, res) => {

    try {
        const getParams = req.query;
        const options = {
            baseUrl: process.env.assets_api,
            uri: '/v1/api/getstoragelist',
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
})

// Get list of Asset Model types
router.get('/getassetmodeltype', (req, res) => {

    try {
        const getParams = req.query;
        const options = {
            baseUrl: process.env.assets_api,
            uri: '/v1/api/getassetmodeltype',
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
})

// Get list of Asset Model types
router.get('/getassetmodel', (req, res) => {

    try {
        const getParams = req.query;
        const options = {
            baseUrl: process.env.assets_api,
            uri: '/v1/api/getassetmodel',
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
})

// Update server data
router.post('/updateassetdetails', (req, res) => {
    try {
        var postParams = req.body;
        request({
            method: 'POST',
            url: 'http://assets.timesinternet.in/v1/api/updateassetdetails',
            json: postParams,
            headers: {
                'X-Email': req.get('X-Email'),
                'X-Token': req.get('X-Token'),
                'Content-Type': 'application/json'
            }
        }, (error, response, body) => {
            console.log(error);
            // console.log(response);
            res.json(body);
        });
  
 
 } catch(e){
    console.log(e);
}
})



module.exports = router;