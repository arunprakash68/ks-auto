const express = require('express');
const router = express.Router();
const httpRequestPromise = require('../../custom-request-promise');

// Get my server(elb) average request time
router.get('/servers/requests', (req, res) => {
    resolvePerfGraphAPIs(req, res, '/api/v0.1/requests');
});

// Get my server(elb) total bytes
router.get('/servers/totalbytes', (req, res) => {
    resolvePerfGraphAPIs(req, res, '/api/v0.1/totalbytes');
});


// Get my server(elb) average request time
router.get('/servers/avgreqtime', (req, res) => {
    resolvePerfGraphAPIs(req, res, '/api/v0.1/avgreqtime');
});


// Get my server(elb) origin bandwidth for monitoring
router.get('/servers/originbandwidth', (req, res) => {
    resolvePerfGraphAPIs(req, res, '/api/v0.1/originbandwidth');
});

// Get my server(elb) edge bandwidth for monitoring
router.get('/servers/edgebandwidth', (req, res) => {
    resolvePerfGraphAPIs(req, res, '/api/v0.1/edgebandwidth');
});


// Get platform distribution for a business (elb)
router.get('/servers/pfdist', (req, res) => {
    resolvePerfGraphAPIs(req, res, '/api/v0.1/pfdist');
});


// Get error distribution for a business (elb)
router.get('/servers/errors', (req, res) => {
    resolvePerfGraphAPIs(req, res, '/api/v0.1/errors');
});


// Get my server(elb) manifest average request time
router.get('/servers/manifestavgreqtime', (req, res) => {
    resolvePerfGraphAPIs(req, res, '/api/v0.1/manifestavgreqtime');
});

// Get my server(elb) Bandwidth Offload time
router.get('/servers/bandwidthoffload', (req, res) => {
    resolvePerfGraphAPIs(req, res, '/api/v0.1/bandwidthoffload');
});

// Get my server(elb) Bandwidth Offload time
router.get('/servers/compedgebandwidth', (req, res) => {
    resolvePerfGraphAPIs(req, res, '/api/v0.1/compedgebandwidth');
});

// Get Performance section Apis city, country , isp
router.get('/servers/asnrequests', (req, res) => {
    resolvePerfGraphAPIs(req, res, '/api/v0.1/asnrequests');
});
router.get('/servers/cityrequests', (req, res) => {
    resolvePerfGraphAPIs(req, res, '/api/v0.1/cityrequests');
});
router.get('/servers/countryrequests', (req, res) => {
    resolvePerfGraphAPIs(req, res, '/api/v0.1/countryrequests');
});
router.get('/servers/asnreqtime', (req, res) => {
    resolvePerfGraphAPIs(req, res, '/api/v0.1/asnreqtime');
});
router.get('/servers/cityreqtime', (req, res) => {
    resolvePerfGraphAPIs(req, res, '/api/v0.1/cityreqtime');
});
router.get('/servers/countryreqtime', (req, res) => {
    resolvePerfGraphAPIs(req, res, '/api/v0.1/countryreqtime');
});

function resolvePerfGraphAPIs(req, res, uri) {
    try {
        const getParams = req.query;
        let options = {
            baseUrl: process.env.cdn_perf_api + ':' + process.env.cdn_api_port,
            uri: uri,
            qs: {
                'start_time': encodeURIComponent(getParams['start_time'] ? getParams['start_time'] : ''),
                'end_time': encodeURIComponent(getParams['end_time'] ? getParams['end_time'] : ''),
                'business': (getParams['business'] ? getParams['business'].toLowerCase() : '')
            },
            method: 'GET',
            json: true,
            timeout: 120000
        }
        if (getParams['service_type']) {
            options.qs.service_type = (getParams['service_type']);
        }
        if (getParams['cp_code']) {
            options.qs.cp_code = (getParams['cp_code']);
        }

        httpRequestPromise.resolveHTTPRequestPromise(options, req, res);

    } catch (e) {
        console.log(options);
        console.log(e);
    }
}

// Get all filters (cpcodes) for performance graphs
router.get('/servers/cpcodes', (req, res) => {
    try {
        const getParams = req.query;
        const options = {
            baseUrl: process.env.cdn_perf_api + ':' + process.env.cdn_api_port,
            uri: '/api/v0.1/cpcodes',
            qs: {
                'business': getParams['business'] ? getParams['business'].toLowerCase() : ''
            },
            method: 'GET',
            json: true
        };

        httpRequestPromise.resolveHTTPRequestPromise(options, req, res);

    } catch (e) {
        console.log(options);
        console.log(e);
    }
});

// Get all status codes
router.get('/responsestatuses', (req, res) => {
    try {

        const options = {
            baseUrl: process.env.cdn_perf_api + ':' + process.env.cdn_api_port,
            uri: '/api/v0.1/esstatuses',
            method: 'GET',
            json: true
        };

        httpRequestPromise.resolveHTTPRequestPromise(options, req, res);

    } catch (e) {
        console.log(options);
        console.log(e);
    }
});

// Get all access logs filter keys
router.get('/esfilterkeys', (req, res) => {
    try {

        const options = {
            baseUrl: process.env.cdn_perf_api + ':' + process.env.cdn_api_port,
            uri: 'api/v0.1/esfilterkeys',
            method: 'GET',
            json: true
        };

        httpRequestPromise.resolveHTTPRequestPromise(options, req, res);

    } catch (e) {
        console.log(options);
        console.log(e);
    }
});

// Get logs json for a business
router.get('/servers/logs', (req, res) => {
    try {
        const getParams = req.query;
        const options = {
            baseUrl: process.env.cdn_perf_api + ':' + process.env.cdn_api_port,
            uri: '/api/v0.1/eslogs',
            qs: {
                'business': (getParams['business'] ? getParams['business'].toLowerCase() : ''),
                'from': encodeURIComponent(getParams['from'] ? getParams['from'] : ''),
                'size': encodeURIComponent(getParams['size'] ? getParams['size'] : ''),
                'filter': (getParams['filter'] ? getParams['filter'] : ''),
                'start_time': encodeURIComponent(getParams['start_time'] ? getParams['start_time'] : ''),
                'end_time': encodeURIComponent(getParams['end_time'] ? getParams['end_time'] : '')
            },
            method: 'GET',
            json: true,
            timeout: 120000
        };

        httpRequestPromise.resolveHTTPRequestPromise(options, req, res);

    } catch (e) {
        console.log(options);
        console.log(e);
    }
});

// Get  logs csv json for a business
router.get('/servers/csvlogs', (req, res) => {
    try {
        const getParams = req.query;
        const options = {
            baseUrl: process.env.cdn_perf_api + ':' + process.env.cdn_api_port,
            uri: '/api/v0.1/eslogsexport',
            qs: {
                'business': (getParams['business'] ? getParams['business'].toLowerCase() : ''),
                'from': 0,
                'size':10000,
                'filter': (getParams['filter'] ? getParams['filter'] : ''),
                'start_time': encodeURIComponent(getParams['start_time'] ? getParams['start_time'] : ''),
                'end_time': encodeURIComponent(getParams['end_time'] ? getParams['end_time'] : '')
            },
            method: 'GET',
            json: true,
            timeout: 120000
        };

        httpRequestPromise.resolveHTTPRequestPromise(options, req, res);

    } catch (e) {
        console.log(options);
        console.log(e);
    }
});

// Get top 10 urls json for a business
router.get('/servers/topurls', (req, res) => {
    try {
        const getParams = req.query;
        var qs = {
            'business': (getParams['business'] ? getParams['business'].toLowerCase() : ''),
            'start_time': (getParams['start_time'] ? getParams['start_time'] : ''),
            'end_time': (getParams['end_time'] ? getParams['end_time'] : ''),
            'status_group': (getParams['status_group'] ? getParams['status_group'] : ''),
            'service_type': (getParams['service_type'] ? getParams['service_type'] : undefined),
            'cp_code': (getParams['cp_code'] ? getParams['cp_code'] : undefined)
        }

        const options = {
            baseUrl: process.env.cdn_perf_api + ':' + process.env.cdn_api_port,
            uri: '/api/v0.1/topurls',
            qs,
            method: 'GET',
            json: true,
            timeout: 120000
        };
        httpRequestPromise.resolveHTTPRequestPromise(options, req, res);

    } catch (e) {
        console.log(options);
        console.log(e);
    }
});

module.exports = router;