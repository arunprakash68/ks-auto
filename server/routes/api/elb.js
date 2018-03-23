const express = require('express');
const router = express.Router();
var request = require('request');
const httpRequestPromise = require('../../custom-request-promise');


// Create VIP starts here
router.post('/createvip', (req, res) => {
    
    try {
        let postParams = req.body;
        let vipport = postParams.vipport;
        let options = {
                    zone: postParams.zone,  
                    vipport: JSON.stringify(postParams.vipport),  
                    project: postParams.project,  
                    bu: postParams.bu,  
                    domain_name: postParams.domain_name,
                    lb_method: postParams.lb_method,
                    env: postParams.env,
                    scheme: postParams.scheme,
                    siteshield: postParams.siteshield,
                    snatpool: (postParams.snatpool ? postParams.snatpool : '')
        };

        let header = {
                    'Content-Type': req.get('Content-Type'), 
                    'X-Email': req.get('X-Email'),
                    'X-Location': postParams.location, 
                    'X-Token': req.get('X-Token')
        };
        
        request({
                method : 'POST',
                url : process.env.auto_api+'/api/v0.1/createvip',
                json : options,
                headers : header
            }, (error, response, body) => {
                res.json(body);
            });

    }catch(e) {
        console.log(e);
    }
})
// Create VIP ends here

// Create Pool starts here
router.post('/createpool', (req, res) => {
    try {
        let postParams = req.body;

        let options = {
                    zone: postParams.zone,  
                    vipmembers: JSON.stringify(postParams.vipmembers), 
                    port: JSON.stringify(postParams.port),  
                    domain_name: postParams.domain_name,
                    lb_method: postParams.lb_method,
                    project: postParams.project,  
                    bu: postParams.bu,  
                    env: postParams.env,
        };

        let header = {
                    'Content-Type': req.get('Content-Type'), 
                    'X-Email': req.get('X-Email'),
                    'X-Location': postParams.location,
                    'X-Token': req.get('X-Token')
        };
        
        request({
                method : 'POST',
                url : process.env.auto_api+'/api/v0.1/createpool',
                json : options,
                headers : header
            }, (error, response, body) => {
                res.json(body);
            });

    }catch(e) {
        console.log(e);
    }
})
// Create Pool ends here

// Create Monitor starts here
router.post('/createmonitor', (req, res) => {
    try {
        let postParams = req.body;

        let options = {
                    zone: postParams.zone,  
                    domain_name: postParams.domain_name,
                    send_string: postParams.send_string,  
                    recv_string: postParams.recv_string
        };

        let header = {
                    'Content-Type': req.get('Content-Type'), 
                    'X-Email': req.get('X-Email'),
                    'X-Location': postParams.location,
                    'X-Token': req.get('X-Token')
        };
        
        request({
                method : 'POST',
                url : process.env.auto_api+'/api/v0.1/healthcheck',
                json : options,
                headers : header
            }, (error, response, body) => {
                res.json(body);
            });

    }catch(e) {
        console.log(e);
    }
})
// Create Monitor ends here

// Attach Monitor to Pool starts here
router.post('/attach/mtop', (req, res) => {
    try {
        let postParams = req.body;

        let options = {
                    monitorname: postParams.monitorname,  
                    poolname: postParams.poolname, 
                    zone: postParams.zone
        };

        let header = {
                    'Content-Type': req.get('Content-Type'), 
                    'X-Email': req.get('X-Email'),
                    'X-Location': postParams.location,
                    'X-Token': req.get('X-Token')
        };
        
        request({
                method : 'POST',
                url : process.env.auto_api+'/api/v0.1/updatepool',
                json : options,
                headers : header
            }, (error, response, body) => {
                res.json(body);
            });

    }catch(e) {
        console.log(e);
    }
})
// Attach Monitor to Pool ends here

// Attach Pool to VIP starts here
router.post('/attach/ptov', (req, res) => {
    try {
        let postParams = req.body;
        let options = {
                    zone: postParams.zone,  
                    vipname: postParams.vipname, 
                    poolname: postParams.poolname
        };

        let header = {
                    'Content-Type': req.get('Content-Type'), 
                    'X-Email': req.get('X-Email'),
                    'X-Location': postParams.location,
                    'X-Token': req.get('X-Token')
        };

        request({
                method : 'POST',
                url : process.env.auto_api+'/api/v0.1/updatevip',
                json : options,
                headers : header
            }, (error, response, body) => {
                res.json(body);
            });

    }catch(e) {
        console.log(e);
    }
})
// Attach Pool to VIP ends here

// Attach SSL to VIP 
router.post('/attach/sslbind', (req, res) => {
    try {
        let postParams = req.body;
        let options = {
                    zone: postParams.zone,  
                    vipname: postParams.vipname, 
                    sslcertname: postParams.sslcertname
        };

        let header = {
                    'Content-Type': req.get('Content-Type'), 
                    'X-Email': req.get('X-Email'),
                    'X-Location': postParams.location,
                    'X-Token': req.get('X-Token')
        };

        request({
                method : 'POST',
                url : process.env.auto_api+'/api/v0.1/sslbind',
                json : options,
                headers : header
            }, (error, response, body) => {
                res.json(body);
            });

    }catch(e) {
        console.log(e);
    }
})


// Enable SSL Redirection 
router.post('/sslredirect', (req, res) => {
    try {
        let postParams = req.body;
        let options = {
                    zone: postParams.zone,  
                    vipname: postParams.vipname
        };

        let header = {
                    'Content-Type': req.get('Content-Type'), 
                    'X-Email': req.get('X-Email'),
                    'X-Location': postParams.location,
                    'X-Token': req.get('X-Token')
        };

        request({
                method : 'POST',
                url : process.env.auto_api+'/api/v0.1/sslredirect',
                json : options,
                headers : header
            }, (error, response, body) => {
                res.json(body);
            });

    }catch(e) {
        console.log(e);
    }
})

module.exports = router;