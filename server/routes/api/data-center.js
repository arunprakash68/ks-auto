const express = require('express');
const router = express.Router();
var request = require('request');
const httpRequestPromise = require('../../custom-request-promise');
const elb = require('./elb');

router.use('/elb',elb);

// Get list of Data Centers
router.get('/', (req, res) => {
    try {
        var options = {
            baseUrl: process.env.dc_api + ':' + process.env.dc_api_port,
            uri: '/api/v0.1/getdc',
            method: 'GET',
            json: true
        }

        httpRequestPromise.resolveHTTPRequestPromise(options, req, res);
    } catch (e) {
        console.log(options);
        console.log(e);
    }
})

// Update server data
router.post('/servers/update', (req, res) => {
    try {
        var postParams = req.body;
        request({
            method: 'POST',
            url: process.env.auto_api + '/api/v0.1/updateproject',
            json: {
                projectname: (postParams['projectname'] ? postParams['projectname'] : null),
                bu: (postParams['bu'] ? postParams['bu'] : null),
                env: (postParams['env'] ? postParams['env'] : null),
                vmid: (postParams['vmid'] ? postParams['vmid'] : null)
            },
            headers: {
                'X-Email': req.get('X-Email'),
                'X-Token': req.get('X-Token')
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


// Create new server
router.post('/servers/new', (req, res) => {

    try {
        let postParams = req.body;
        let dcZone = postParams['zone'];
        let zoneApi = '';
        if(dcZone){
            if(dcZone === 'TIL-MUM-Zone') {
                zoneApi = process.env.til_mum_zone_server_create_api;
            } else if(dcZone === 'TIL-CHN-Zone') {
                zoneApi = process.env.til_chn_zone_server_create_api;
            } else if(dcZone === 'MBRSL-CHN-Zone') {
                zoneApi = process.env.mbrsl_chn_zone_server_create_api;
            } else if(dcZone === 'MBRSL-MUM-Zone') {
                zoneApi = process.env.mbrsl_mum_zone_server_create_api;
            } else if(dcZone === 'TIL-MUM-Zone2') {
                zoneApi = process.env.til_mum_zone2_server_create_api;
            } else if(dcZone === 'TBS-MUM-Zone'){
                zoneApi = process.env.tbs_mum_zone_server_create_api;
            }
        }
        request({
            method: 'POST',
            url: zoneApi + ':' + process.env.server_create_api_port + '/api/v0.1/createcluster',
            json: {
                bu: (postParams['bu'] ? postParams['bu'] : null),
                project: (postParams['project'] ? postParams['project'] : null),
                zone: (postParams['zone'] ? postParams['zone'] : null),
                vmtype: (postParams['vmtype'] ? postParams['vmtype'] : null),
                vmsize: (postParams['vmsize'] ? postParams['vmsize'] : null),
                ostype: (postParams['ostype'] ? postParams['ostype'] : null),
                networkvalue: (postParams['networkvalue'] ? postParams['networkvalue'] : null),
                monitoringvalue: (postParams['monitoringvalue'] ? postParams['monitoringvalue'] : null),
                department: (postParams['department'] ? postParams['department'] : null),
                quantity: (postParams['quantity'] ? postParams['quantity'] : null)
            },
            headers: {
                'X-Email': req.get('X-Email'),
                'X-Token': req.get('X-Token'),
                'X-Department': req.get('X-Department')
            }
        }, (error, response, body) => {
            if(error) {
                console.log(error);
                res.status(error.statusCode ? error.statusCode : 500);
                res.send(null);
            }
            res.json(body);
        });
    } catch(e) {
        console.log(e);        
    }


})


// Get my storages list
router.get('/storages', (req, res) => {
    try {
        var getParams = req.query;
        var options = {
            baseUrl: process.env.dc_api + ':' + process.env.dc_api_port,
            uri: '/api/v0.1/getrdmmap',
            qs: {
                'username': encodeURIComponent(req.get('X-Email') ? req.get('X-Email') : ''),
                'searchvalue': encodeURIComponent(getParams['search_value'] ? getParams['search_value'] : ''),
                's_count': encodeURIComponent(getParams['start_count'] ? getParams['start_count'] : '0'),
                'e_count': '16', 
                'project':  encodeURIComponent(getParams['project'] ? getParams['project'] : ''),
                'env': encodeURIComponent(getParams['env'] ? getParams['env'] : ''),
                'location': encodeURIComponent(getParams['location'] ? getParams['location'] : ''),
                'status': encodeURIComponent(getParams['status'] ? getParams['status'] : '1'),
                'vmtype': encodeURIComponent(getParams['vm_type'] ? getParams['vm_type'] : ''),
                'bu': encodeURIComponent(getParams['business'] ? getParams['business'] : '')
            },
            method: 'GET',
            json: true,
            headers: {
                'Content-Type': 'application/json',
                'X-Email': req.get('X-Email'),
                'X-Token': req.get('X-Token')
            }
        }
        // var handleResponse = function(jsonData) {
            // try {
            //     if(jsonData && jsonData[1] && Array.isArray(jsonData[1]) && jsonData[1].length > 0 && typeof jsonData[1][0] != 'string') {
            //         res.json(jsonData);
            //     } else {
            //         res.json(null);
            //     }
            // } catch (e) {
            //     console.log(options);
            //     console.log(e);
            // }
            // res.json(jsonData);
        // }

        httpRequestPromise.resolveHTTPRequestPromise(options, req, res);
        
    } catch(e){
        console.log(options);
        console.log(e);
    }
})

// Get my clusters list
router.post('/clusters', (req, res) => {
    try {
        var postParams = req.body;
        var options = {
            baseUrl: process.env.auto_api + ':5000',
            uri: '/api/v0.1/viplist',
            qs: {
                'username': encodeURIComponent(postParams['email'] ? postParams['email'] : ''),
                'searchvalue': encodeURIComponent(postParams['search_value'] ? postParams['search_value'] : ''),
                's_count': encodeURIComponent(postParams['start_count'] ? postParams['start_count'] : '0'),
                'e_count': '16', 
                'project':  encodeURIComponent(postParams['project'] ? postParams['project'] : ''),
                'env': encodeURIComponent(postParams['env'] ? postParams['env'] : ''),
                'location': encodeURIComponent(postParams['location'] ? postParams['location'] : ''),
                'health': encodeURIComponent(postParams['health'] ? postParams['health'] : '1'),
                'range': encodeURIComponent(postParams['range'] ? postParams['range'] : ''),
                'port': encodeURIComponent(postParams['port'] ? postParams['port'] : ''),
                'bu': encodeURIComponent(postParams['business'] ? postParams['business'] : '')
            } ,
            method: 'GET',
            json: true,
            headers: {
                'Content-Type': 'application/json',
                'X-Email': postParams['email'],
                'X-Token': postParams['token']
            }
        }
        httpRequestPromise.resolveHTTPRequestPromise(options, req, res);

    } catch(e){
        console.log(options);
        console.log(e);
    }
})

// Get my server alerts
router.get('/servers/alerts', (req, res) => {
    try {
        var getParams = req.query;
        var options = {
            baseUrl: process.env.auto_api + ':' + process.env.auto_api_port,
            uri: '/api/v0.1/checkalert',
            qs: {
                'host': encodeURIComponent(getParams['host'] ? getParams['host'] : ''),
                'limit': '16',
                'offset': encodeURIComponent(getParams['offset'] ? getParams['offset'] : '0') 
            },
            method: 'GET',
            json: true,
            headers: {
                'Accept': 'application/json',
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


// Get server stats
router.get('/servers/stats', (req, res) => {
    try {
        var getParams = req.query;
        var options = {
            // host: '192.169.36.243',
            baseUrl: process.env.auto_api + ':' + process.env.auto_api_port,
            uri: '/api/v0.1/influxdata',
            qs: {
                'Hostname': encodeURIComponent(getParams['hostname'] ? getParams['hostname'] : ''),
                'metric': encodeURIComponent(getParams['metric'] ? getParams['metric'] : ''),
                'start_time': encodeURIComponent(getParams['start_time'] ? getParams['start_time'] : ''),
                'end_time': encodeURIComponent(getParams['end_time'] ? getParams['end_time'] : '') 
            },
            method: 'GET',
            json: true,
            headers: {
                'Accept': 'application/json',
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


// Get list of zones for given business and project
router.get('/zones', (req, res) => {
    try {
        const getParams = req.query
        var options = {
            baseUrl: process.env.dc_api + ':' + process.env.dc_api_port,
            uri: '/api/v0.1/getzone',
            qs: {
                'bu': (getParams['bu']),
                'project': (getParams['project'])
            },
            method: 'GET',
            json: true
        }

        httpRequestPromise.resolveHTTPRequestPromise(options, req, res);
    } catch (e) {
        console.log(options);
        console.log(e);
    }
})

// Get list of OS for given datacenter id
router.get('/os', (req, res) => {
    try {
        const getParams = req.query;
        var options = {
            baseUrl: process.env.dc_api + ':' + process.env.dc_api_port,
            uri: '/api/v0.1/getos',
            qs: {
                'zone': getParams['zone']
            },
            method: 'GET',
            json: true
        }

        httpRequestPromise.resolveHTTPRequestPromise(options, req, res);
    } catch (e) {
        console.log(options);
        console.log(e);
    }
})

// Get list of vm types for given datacenter id and OS name
router.get('/os/vm-type', (req, res) => {
    try {
        const getParams = req.query;
        var options = {
            baseUrl: process.env.dc_api + ':' + process.env.dc_api_port,
            uri: '/api/v0.1/getvmtype',
            qs: {
                'id': getParams['id'],
                'os': getParams['os']
            },
            method: 'GET',
            json: true
        }
        httpRequestPromise.resolveHTTPRequestPromise(options, req, res);
    } catch (e) {
        console.log(options);
        console.log(e);
    }
})


// Get list of images for given os name
router.get('/os/images', (req, res) => {
    try {
        const getParams = req.query;
        var options = {
            baseUrl: process.env.dc_api + ':' + process.env.dc_api_port,
            uri: '/api/v0.1/gettemplate',
            qs: {
                'os': getParams['os']
            },
            method: 'GET',
            json: true
        }

        httpRequestPromise.resolveHTTPRequestPromise(options, req, res);
    } catch (e) {
        console.log(options);
        console.log(e);
    }
})

// Get my servers list
router.get('/servers', (req, res) => {
	try {
		const getParams = req.query;
		const options = {
			baseUrl: process.env.dc_api + ':' + process.env.dc_api_port,
			uri: '/api/v0.1/getvmsearch',
            qs: { 
             'searchvalue': encodeURIComponent(getParams['search_value'] ? getParams['search_value'] : ''),
             's_count': encodeURIComponent(getParams['start_count'] ? getParams['start_count'] : ''),
             'e_count':  encodeURIComponent(getParams['end_count'] ? getParams['end_count'] : ''),
             'project':  (getParams['project'] ? getParams['project'] : ''),
             'env': encodeURIComponent(getParams['env'] ? getParams['env'] : ''),
             'location': encodeURIComponent(getParams['location'] ? getParams['location'] : ''),
             'status': encodeURIComponent(getParams['status'] ? getParams['status'] : ''),
             'vmtype': encodeURIComponent(getParams['vm_type'] ? getParams['vm_type'] : ''),
             'servertype': encodeURIComponent(getParams['servertype'] ? getParams['servertype'] : ''),
             'bu': (getParams['business'] ? getParams['business'] : '') 
         },
         method: 'GET',
         json: true,
         headers: {
            'Content-Type': 'application/json',
                // 'X-Email': 'testtoken@timesinternet.in',
                'X-Email': req.get('X-Email'),
                // 'X-Token': 'f85307a7c73640e75cfb9af4a325f5d1f3c1583d9916cf2565a0dd2e5919a6f7',
                'X-Token': req.get('X-Token')
            }
        }
        
        httpRequestPromise.resolveHTTPRequestPromise(options, req, res);
    } catch(e){
       console.log(options);
       console.log(e);
   }
})

// Get my servers summary
router.get('/serversummary', (req, res) => {
	try {
		const getParams = req.query;
		const options = {
            baseUrl: process.env.auto_api,
            uri: '/api/v0.1/serversummary',
            qs: { 
                's_count': getParams['s_count'],
                'e_count': getParams['e_count']
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


// Get my elb list
router.get('/vipsummary', (req, res) => {
    try {
        const getParams = req.query;
        const options = {
            baseUrl: process.env.auto_api,
            uri: '/api/v0.1/vipsummary',
            qs: { 
                's_count': getParams['s_count'],
                'e_count': getParams['e_count'],
                'bu': getParams['bu'] ? getParams['bu'] : '',
                'project': getParams['project'] ? getParams['project'] : '',
                'env': getParams['env'] ? getParams['env'] : '',
                'zone': getParams['zone'] ? getParams['zone'] : ''
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

// Get my elb stats
router.get('/vipstats', (req, res) => {
    try {
        const getParams = req.query;
        const options = {
            baseUrl: process.env.auto_api,
            uri: '/api/v0.1/vipstats',
            qs: { 
                'location': getParams['location'],
                'vipip': getParams['vipip'],
                'statstype': getParams['statstype']
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

// Get my elb location zones
router.get('/locations', (req, res) => {
    try {
        const getParams = req.query;
        const options = {
            baseUrl: process.env.auto_api,
            uri: '/api/v0.1/locations',
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

// Get lb methods list
router.get('/lbalgo', (req, res) => {
    try {
        const getParams = req.query;
        const options = {
            baseUrl: process.env.auto_api,
            uri: '/api/v0.1/lbalgo',
            qs: { 
                'zone': getParams['zone'] ? getParams['zone'] : ''
            },
            method: 'GET',
            json: true,
            headers: {
                'Content-Type': 'application/json',
                'X-Email': req.get('X-Email'),
                'X-Token': req.get('X-Token'),
                'X-Location': (getParams['location'] ? getParams['location'] : '')
            }
        }
        
        httpRequestPromise.resolveHTTPRequestPromise(options, req, res);

    } catch(e){
        console.log(options);
        console.log(e);
    }
})

// Get SSL certificates
router.get('/sslcert', (req, res) => {
    try {
        const getParams = req.query;
        var qs = { 
            'zone': getParams['zone'] ? getParams['zone'] : '',
            'type' : getParams['type'] ? getParams['type'] : ''
        };
        const options = {
            baseUrl: process.env.auto_api,
            uri: '/api/v0.1/sslcert',
            qs,
            method: 'GET',
            json: true,
            headers: {
                'Content-Type': 'application/json',
                'X-Email': req.get('X-Email'),
                'X-Token': req.get('X-Token'),
                'X-Location': (getParams['location'] ? getParams['location'] : '')
            }
        }
        
        httpRequestPromise.resolveHTTPRequestPromise(options, req, res);

    } catch(e){
        console.log(options);
        console.log(e);
    }
})

// Get snat pools
router.get('/snatpools', (req, res) => {
    try {
        const getParams = req.query;
        var qs = { 
            'zone': getParams['zone'] ? getParams['zone'] : '',
        };
        const options = {
            baseUrl: process.env.auto_api,
            uri: '/api/v0.1/snatpools',
            qs,
            method: 'GET',
            json: true,
            headers: {
                'Content-Type': 'application/json',
                'X-Email': req.get('X-Email'),
                'X-Token': req.get('X-Token'),
                'X-Location': (getParams['location'] ? getParams['location'] : '')
            }
        }
        
        httpRequestPromise.resolveHTTPRequestPromise(options, req, res);

    } catch(e){
        console.log(options);
        console.log(e);
    }
})

module.exports = router;