const express = require('express');
const router = express.Router()
const httpRequestPromise = require('../custom-request-promise');
const datacenter = require('./api/data-center');
const cdn = require('./api/cdn');
const cost = require('./api/cost');


router.use('/data-center', datacenter);

router.use('/cdn', cdn);

router.use('/cost', cost);


router.get('/business-access-details', (req, res, next) => {

    try {
        const options = {
            baseUrl: process.env.dc_api + ':' + process.env.dc_api_port,
            uri: '/api/v0.1/getbuprojmap',
            qs: {
                'username': encodeURIComponent(req.get('X-Email'))
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

    } catch (e) {
        console.log(e);
    }

})


module.exports = router;

