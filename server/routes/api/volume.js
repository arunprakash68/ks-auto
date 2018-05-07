const express = require('express');
const router = express.Router();
var request = require('request');
const httpRequestPromise = require('../../custom-request-promise');


// Create VIP starts here
router.get('/fetchall', (req, res) => {
    
    try {
     
        const getParams = req.query;
        var qs = { 
            's_count': getParams['s_count'],
            'e_count': getParams['e_count'],
            // 'bu': getParams['bu'] ? getParams['bu'] : '',
            // 'project': getParams['project'] ? getParams['project'] : '',
            // 'env': getParams['env'] ? getParams['env'] : '',
            // 'zone': getParams['zone'] ? getParams['zone'] : ''
        };
        const options = {
            baseUrl: process.env.volume_api,
            uri: '/api/v0.1/volume',
            qs,
            method: 'GET',
            json: true,
            headers: {
                'Content-Type': 'application/json',
                'X-Location':getParams['location']
            }
        }
        
        httpRequestPromise.resolveHTTPRequestPromise(options, req, res);

    }catch(e) {
        console.log(e);
    }
})
// Create VIP ends here


module.exports = router;