const express = require('express');
const router = express.Router();
const http = require('http');
var request = require('request');

// const MongoClient = require('mongodb').MongoClient;
// const ObjectID = require('mongodb').ObjectID;

// Connect
const connection = (closure) => {
    return MongoClient.connect('mongodb://localhost:27017/mean', (err, db) => {
        if (err) return console.log(err);

        closure(db);
    });
};

// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

// Get list of Data Centers
router.get('/data-centers', (req, res) => {
    try {
        var options = {
            host: '192.168.33.212',
            port: 5000,
            path: '/api/v0.1/getdc',
            method: 'GET'
        }

        resolveHTTPRequest(options, req, res);
    } catch (e) {
        console.log(options);
        console.log(e);
    }
})

// Get list of zones for given business and project
router.get('/data-centers/zones', (req, res) => {
    try {
        const getParams = req.query
        var options = {
            host: '192.168.33.212',
            port: 5000,
            path: '/api/v0.1/getzone?' + 
            'bu=' + encodeURIComponent(getParams['bu']) + 
            '&project=' + encodeURIComponent(getParams['project']),
            method: 'GET'
        }

        resolveHTTPRequest(options, req, res);
    } catch (e) {
        console.log(options);
        console.log(e);
    }
})

// Get list of OS for given datacenter id
router.get('/data-centers/os', (req, res) => {
    try {
        const getParams = req.query;
        var options = {
            host: '192.168.33.212',
            port: 5000,
            path: '/api/v0.1/getos?zone=' + getParams['zone'],
            method: 'GET'
        }

        resolveHTTPRequest(options, req, res);
    } catch (e) {
        console.log(options);
        console.log(e);
    }
})

// Get list of vm types for given datacenter id and OS name
router.get('/data-centers/os/vm-type', (req, res) => {
    try {
        const getParams = req.query;
        var options = {
            host: '192.168.33.212',
            port: 5000,
            path: '/api/v0.1/getvmtype?id=' + getParams['id'] + '&os=' + getParams['os'],
            method: 'GET'
        }
        console.log(options);
        resolveHTTPRequest(options, req, res);
    } catch (e) {
        console.log(options);
        console.log(e);
    }
})


// Get list of images for given os name
router.get('/data-centers/os/images', (req, res) => {
    try {
        const getParams = req.query;
        var options = {
            host: '192.168.33.212',
            port: 5000,
            path: '/api/v0.1/gettemplate?os=' + getParams['os'],
            method: 'GET'
        }

        resolveHTTPRequest(options, req, res);
    } catch (e) {
        console.log(options);
        console.log(e);
    }
})




// Get project and businesss access details for a given user
// router.post('/business-access-details', (req, res, next) => {

//     // res.send(`
//     // {
//     //     "bu": ["GAANA","ET"]
//     // }
//     // `);
//     try {
//         var options = {
//             host: '192.169.36.243',
//             path: '/api/v0.1/buaccess?username=' + req.body.email,
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'X-Email': req.body.email,
//                 'X-Token': req.body.token 
//             }
//         }

//         resolveHTTPRequest(options, req, res);

//     } catch (e) {
//         console.log(e);
//     }

// })


// Get project and businesss access details for a given user
router.get('/business-access-details', (req, res, next) => {

    try {
        const options = {
            // host: '192.169.33.123',
            // port: 5000,
            host: '192.168.33.212',
            port: 5000,
            path: '/api/v0.1/getbuprojmap?' + 
            'username=' + encodeURIComponent(req.get('X-Email')),
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Email': req.get('X-Email'),
                'X-Token': req.get('X-Token') 
            }
        }

        resolveHTTPRequest(options, req, res);

    } catch (e) {
        console.log(e);
    }

})


// Get my server(elb) average request time
router.get('/servers/requests', (req, res) => {
    try {
        var getParams = req.query;
        var options = {
            host: '172.26.102.104',
            port: 5001,
            path: '/api/v0.1/requests?' + 
            'start_time=' + encodeURIComponent(getParams['start_time'] ? getParams['start_time'] : '') +
            '&end_time=' + encodeURIComponent(getParams['end_time'] ? getParams['end_time'] : '') +
            '&business=' + encodeURIComponent(getParams['business'] ? getParams['business'].toLowerCase() : '') ,
            method: 'GET'
        }
        if (getParams['service_type']) {
            options.path += '&service_type=' + encodeURIComponent(getParams['service_type']);
        }
        if (getParams['cp_code']) {
            options.path += '&cp_code=' + encodeURIComponent(getParams['cp_code']);
        }
        resolveHTTPRequest(options, req, res);

    } catch(e) {
        console.log(options);
        console.log(e);
    }
});

// Get my server(elb) total bytes
router.get('/servers/totalbytes', (req, res) => {
    try {
        var getParams = req.query;
        var options = {
            host: '172.26.102.104',
            port: 5001,
            path: '/api/v0.1/totalbytes?' + 
            'start_time=' + encodeURIComponent(getParams['start_time'] ? getParams['start_time'] : '') +
            '&end_time=' + encodeURIComponent(getParams['end_time'] ? getParams['end_time'] : '') +
            '&business=' + encodeURIComponent(getParams['business'] ? getParams['business'].toLowerCase() : '') ,
            method: 'GET'
        }
        if (getParams['service_type']) {
            options.path += '&service_type=' + encodeURIComponent(getParams['service_type']);
        }
        if (getParams['cp_code']) {
            options.path += '&cp_code=' + encodeURIComponent(getParams['cp_code']);
        }
        resolveHTTPRequest(options, req, res);

    } catch(e) {
        console.log(options);
        console.log(e);
    }
});


// Get my server(elb) average request time
router.get('/servers/avgreqtime', (req, res) => {
    try {
        var getParams = req.query;
        var options = {
            host: '172.26.102.104',
            port: 5001,
            path: '/api/v0.1/avgreqtime?' + 
            'start_time=' + encodeURIComponent(getParams['start_time'] ? getParams['start_time'] : '') +
            '&end_time=' + encodeURIComponent(getParams['end_time'] ? getParams['end_time'] : '') +
            '&business=' + encodeURIComponent(getParams['business'] ? getParams['business'].toLowerCase() : '') ,
            method: 'GET'
        }
        if (getParams['service_type']) {
            options.path += '&service_type=' + encodeURIComponent(getParams['service_type']);
        }
        if (getParams['cp_code']) {
            options.path += '&cp_code=' + encodeURIComponent(getParams['cp_code']);
        }
        resolveHTTPRequest(options, req, res);

    } catch(e) {
        console.log(options);
        console.log(e);
    }
});


// Get my server(elb) origin bandwidth for monitoring
router.get('/servers/originbandwidth', (req, res) => {
    try {
        var getParams = req.query;
        var options = {
            host: '172.26.102.104',
            port: 5001,
            path: '/api/v0.1/originbandwidth?' + 
            'start_time=' + encodeURIComponent(getParams['start_time'] ? getParams['start_time'] : '') +
            '&end_time=' + encodeURIComponent(getParams['end_time'] ? getParams['end_time'] : '') +
            '&business=' + encodeURIComponent(getParams['business'] ? getParams['business'].toLowerCase() : '') ,
            method: 'GET'
        }
        if (getParams['service_type']) {
            options.path += '&service_type=' + encodeURIComponent(getParams['service_type']);
        }
        if (getParams['cp_code']) {
            options.path += '&cp_code=' + encodeURIComponent(getParams['cp_code']);
        }
        resolveHTTPRequest(options, req, res);

    } catch(e) {
        console.log(options);
        console.log(e);
    }
});

// Get my server(elb) edge bandwidth for monitoring
router.get('/servers/edgebandwidth', (req, res) => {
    try {
        var getParams = req.query;
        var options = {
            host: '172.26.102.104',
            port: 5001,
            path: '/api/v0.1/edgebandwidth?' + 
            'start_time=' + encodeURIComponent(getParams['start_time'] ? getParams['start_time'] : '') +
            '&end_time=' + encodeURIComponent(getParams['end_time'] ? getParams['end_time'] : '') +
            '&business=' + encodeURIComponent(getParams['business'] ? getParams['business'].toLowerCase() : '') ,
            method: 'GET'
        }
        if (getParams['service_type']) {
            options.path += '&service_type=' + encodeURIComponent(getParams['service_type']);
        }
        if (getParams['cp_code']) {
            options.path += '&cp_code=' + encodeURIComponent(getParams['cp_code']);
        }
        resolveHTTPRequest(options, req, res);

    } catch(e) {
        console.log(options);
        console.log(e);
    }
});


// Get platform distribution for a business (elb)
router.get('/servers/pfdist', (req, res) => {
    try {
        var getParams = req.query;
        var options = {
            host: '172.26.102.104',
            port: 5001,
            path: '/api/v0.1/pfdist?' + 
            'start_time=' + encodeURIComponent(getParams['start_time'] ? getParams['start_time'] : '') +
            '&end_time=' + encodeURIComponent(getParams['end_time'] ? getParams['end_time'] : '') +
            '&business=' + encodeURIComponent(getParams['business'] ? getParams['business'].toLowerCase() : '') ,
            method: 'GET'
        }
        if (getParams['service_type']) {
            options.path += '&service_type=' + encodeURIComponent(getParams['service_type']);
        }
        if (getParams['cp_code']) {
            options.path += '&cp_code=' + encodeURIComponent(getParams['cp_code']);
        }
        resolveHTTPRequest(options, req, res);

    } catch(e) {
        console.log(options);
        console.log(e);
    }
});


// Get error distribution for a business (elb)
router.get('/servers/errors', (req, res) => {
    try {
        var getParams = req.query;
        var options = {
            host: '172.26.102.104',
            port: 5001,
            path: '/api/v0.1/errors?' + 
            'start_time=' + encodeURIComponent(getParams['start_time'] ? getParams['start_time'] : '') +
            '&end_time=' + encodeURIComponent(getParams['end_time'] ? getParams['end_time'] : '') +
            '&business=' + encodeURIComponent(getParams['business'] ? getParams['business'].toLowerCase() : '') ,
            method: 'GET'
        }
        if (getParams['service_type']) {
            options.path += '&service_type=' + encodeURIComponent(getParams['service_type']);
        }
        if (getParams['cp_code']) {
            options.path += '&cp_code=' + encodeURIComponent(getParams['cp_code']);
        }
        resolveHTTPRequest(options, req, res);

    } catch(e) {
        console.log(options);
        console.log(e);
    }
});


// Get my server(elb) manifest average request time
router.get('/servers/manifestavgreqtime', (req, res) => {
    try {
        var getParams = req.query;
        var options = {
            host: '172.26.102.104',
            port: 5001,
            path: '/api/v0.1/manifestavgreqtime?' + 
            'start_time=' + encodeURIComponent(getParams['start_time'] ? getParams['start_time'] : '') +
            '&end_time=' + encodeURIComponent(getParams['end_time'] ? getParams['end_time'] : '') +
            '&business=' + encodeURIComponent(getParams['business'] ? getParams['business'].toLowerCase() : '') ,
            method: 'GET'
        }
        if (getParams['service_type']) {
            options.path += '&service_type=' + encodeURIComponent(getParams['service_type']);
        }
        if (getParams['cp_code']) {
            options.path += '&cp_code=' + encodeURIComponent(getParams['cp_code']);
        }
        resolveHTTPRequest(options, req, res);

    } catch(e) {
        console.log(options);
        console.log(e);
    }
});

// Get all filters (cpcodes) for performance graphs
router.get('/servers/cpcodes', (req, res) => {
    try {
        var getParams = req.query;
        var options = {
            host: '172.26.102.104',
            port: 5001,
            path: '/api/v0.1/cpcodes?' + 
            '&business=' + encodeURIComponent(getParams['business'] ? getParams['business'].toLowerCase() : '') ,
            method: 'GET'
        }
        // res.send('{"items":[{"cp_code":426516,"cp_code_name":"HD Live MirchiTopTucker","business":"Gaana","service_type":"Live Media"},{"cp_code":399837,"cp_code_name":"399837(YoPunjabiHDLive)","business":"Gaana","service_type":"VOD Media"},{"cp_code":559929,"cp_code_name":"css373.gaanacdn.com","business":"Gaana","service_type":"WEB"},{"cp_code":436597,"cp_code_name":"css375.gaanacdn.com","business":"Gaana","service_type":"WEB"},{"cp_code":395822,"cp_code_name":"395822(DevraagHDLive)","business":"Gaana","service_type":"Live Media"},{"cp_code":437340,"cp_code_name":"Micromax - MeethiMirchiHDLive","business":"Gaana","service_type":"Live Media"},{"cp_code":398250,"cp_code_name":"download.gaana.com","business":"Gaana","service_type":"VOD Media"},{"cp_code":525250,"cp_code_name":"Tagore Radio","business":"Gaana","service_type":"Live Media"},{"cp_code":575124,"cp_code_name":"Mirchi Love Telugu","business":"Gaana","service_type":"Live Media"},{"cp_code":437345,"cp_code_name":"Micromax - MirchiRockistanHDLive","business":"Gaana","service_type":"Live Media"},{"cp_code":487585,"cp_code_name":"Live Video Streaming","business":"Gaana","service_type":"Live Media"},{"cp_code":505243,"cp_code_name":"Campus Radio","business":"Gaana","service_type":"VOD Media"},{"cp_code":582083,"cp_code_name":"Gaana Vod new","business":"Gaana","service_type":"VOD Media"},{"cp_code":437341,"cp_code_name":"Micromax - RadioRomanceHDLive","business":"Gaana","service_type":"Live Media"},{"cp_code":396578,"cp_code_name":"396578(DevraagHDLive)","business":"Gaana","service_type":"Live Media"},{"cp_code":437343,"cp_code_name":"Micromax - CassetteClassicsHDLive","business":"Gaana","service_type":"Live Media"},{"cp_code":264069,"cp_code_name":"264069(Gaana-HDS)","business":"Gaana","service_type":"VOD Media"},{"cp_code":379772,"cp_code_name":"379772(MirchiTapakaHDLive)","business":"Gaana","service_type":"Live Media"},{"cp_code":395559,"cp_code_name":"395559(RadioRomanceHDLive)","business":"Gaana","service_type":"Live Media"},{"cp_code":454476,"cp_code_name":"Mirchi Mahfil Live","business":"Gaana","service_type":"Live Media"},{"cp_code":437351,"cp_code_name":"Micromax - YoPunjabiHDLive","business":"Gaana","service_type":"Live Media"},{"cp_code":437348,"cp_code_name":"Micromax - PehlaNashaHDLive","business":"Gaana","service_type":"Live Media"},{"cp_code":458720,"cp_code_name":"wmirchi-lh.akamaihd.net ","business":"Gaana","service_type":"Live Media"},{"cp_code":437344,"cp_code_name":"Micromax - ClubMirchiHDLive","business":"Gaana","service_type":"Live Media"},{"cp_code":441975,"cp_code_name":"streams.gaana.com.secure","business":"Gaana","service_type":"VOD Media"},{"cp_code":437313,"cp_code_name":"Micromax - a10.gaanacdn.com","business":"Gaana","service_type":"WEB"},{"cp_code":278014,"cp_code_name":"278014(Hitz - HLS)","business":"Gaana","service_type":"Live Media"},{"cp_code":437350,"cp_code_name":"Micromax - MirchiTapakaHDLive","business":"Gaana","service_type":"Live Media"},{"cp_code":396577,"cp_code_name":"396577(FilmyMirchiHDLive)","business":"Gaana","service_type":"VOD Media"},{"cp_code":437331,"cp_code_name":"Micromax - dl.gaana.com","business":"Gaana","service_type":"VOD Media"},{"cp_code":560200,"cp_code_name":"Kannada Hits","business":"Gaana","service_type":"Live Media"},{"cp_code":437342,"cp_code_name":"Micromax - PuraniJeansHDLive","business":"Gaana","service_type":"Live Media"},{"cp_code":401114,"cp_code_name":"Gaana Mobile","business":"Gaana","service_type":"WEB"},{"cp_code":395123,"cp_code_name":"395123(PuraniJeansHDLive)","business":"Gaana","service_type":"Live Media"},{"cp_code":395122,"cp_code_name":"395122(CassetteClassicsHDLive)","business":"Gaana","service_type":"Live Media"},{"cp_code":437346,"cp_code_name":"Micromax - DevraagHDLive","business":"Gaana","service_type":"Live Media"},{"cp_code":439964,"cp_code_name":"MT20 Live","business":"Gaana","service_type":"Live Media"},{"cp_code":559926,"cp_code_name":"css373.gaanacdn.com","business":"Gaana","service_type":"WEB"},{"cp_code":376101,"cp_code_name":"376101(MeethiMirchiHDLive)","business":"Gaana","service_type":"VOD Media"},{"cp_code":395821,"cp_code_name":"395821(PehlaNashaHDLive)","business":"Gaana","service_type":"VOD Media"},{"cp_code":396579,"cp_code_name":"396579(ClubMirchiHDLive)","business":"Gaana","service_type":"Live Media"},{"cp_code":437332,"cp_code_name":"Micromax - streams.gaana.com","business":"Gaana","service_type":"VOD Media"},{"cp_code":130743,"cp_code_name":"streams gaana com","business":"Gaana","service_type":"VOD Media"},{"cp_code":437347,"cp_code_name":"Micromax - FilmyMirchiHDLive","business":"Gaana","service_type":"Live Media"}],"href":"/api/v0.1/cpcodes"}');
        resolveHTTPRequest(options, req, res);

    } catch(e) {
        console.log(options);
        console.log(e);
    }
});

// Get all status codes
router.get('/responsestatuses', (req, res) => {
    try {
        
        var options = {
            host: '172.26.102.104',
            port: 5001,
            path: '/api/v0.1/esstatuses',
            method: 'GET'
        }

        resolveHTTPRequest(options, req, res);

    } catch(e) {
        console.log(options);
        console.log(e);
    }
});

// Get logs json for a business
router.get('/servers/logs', (req, res) => {
    try {
        var getParams = req.query;
        var options = {
            host: '172.26.102.104',
            port: 5001,
            path: '/api/v0.1/eslogs?' + 
            '&business=' + encodeURIComponent(getParams['business'] ? getParams['business'].toLowerCase() : '') +
            '&from=' + encodeURIComponent(getParams['from'] ? getParams['from'] : '') +
            '&size=' + encodeURIComponent(getParams['size'] ? getParams['size'] : '') +
            '&filter=' + encodeURIComponent(getParams['filter'] ? getParams['filter'] : '') +
            '&start_time=' + encodeURIComponent(getParams['start_time'] ? getParams['start_time'] : '') +
            '&end_time=' + encodeURIComponent(getParams['end_time'] ? getParams['end_time'] : '') ,
            method: 'GET'
        }

        resolveHTTPRequest(options, req, res);

    } catch(e) {
        console.log(options);
        console.log(e);
    }
});




// Get my server alerts
router.get('/servers/alerts', (req, res) => {
    try {
        var getParams = req.query;
        var options = {
            // host: '192.169.36.243',
            host: 'autoapi.indiatimes.com',
            port: 80,
            path: '/api/v0.1/checkalert?' + 
            'host=' + encodeURIComponent(getParams['host'] ? getParams['host'] : '') +
            '&limit=16' +
            '&offset=' + encodeURIComponent(getParams['offset'] ? getParams['offset'] : '0') ,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'X-Email': req.get('X-Email'),
                'X-Token': req.get('X-Token')
            }
    }
    resolveHTTPRequest(options, req, res);

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
            host: 'autoapi.indiatimes.com',
            port: 80,
            path: '/api/v0.1/influxdata?' + 
            'Hostname=' + encodeURIComponent(getParams['hostname'] ? getParams['hostname'] : '') +
            '&metric=' + encodeURIComponent(getParams['metric'] ? getParams['metric'] : '') +
            '&start_time=' + encodeURIComponent(getParams['start_time'] ? getParams['start_time'] : '') +
            '&end_time=' + encodeURIComponent(getParams['end_time'] ? getParams['end_time'] : '') ,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'X-Email': req.get('X-Email'),
                'X-Token': req.get('X-Token')
            }
        }
    resolveHTTPRequest(options, req, res);

} catch(e){
    console.log(options);
    console.log(e);
}
});




// // Get my servers list
// router.get('/servers', (req, res) => {
//     try {
//         var getParams = req.query;
//         var options = {
//             host: '192.168.33.212',
//             port: 5000,
//             path: '/api/v0.1/getvmsearch?' + 
//             'searchvalue=' + encodeURIComponent(getParams['search_value'] ? getParams['search_value'] : '') +
//             '&s_count=' + encodeURIComponent(getParams['start_count'] ? getParams['start_count'] : '0') + 
//             '&e_count=16' + 
//             '&project=' +  encodeURIComponent(getParams['project'] ? getParams['project'] : '') +
//             '&env=' + encodeURIComponent(getParams['env'] ? getParams['env'] : '') +
//             '&location=' + encodeURIComponent(getParams['location'] ? getParams['location'] : '') +
//             '&status=' + encodeURIComponent(getParams['status'] ? getParams['status'] : '') +
//             '&vmtype=' + encodeURIComponent(getParams['vm_type'] ? getParams['vm_type'] : '') +
//             '&servertype=' + encodeURIComponent(getParams['servertype'] ? getParams['servertype'] : '') +
//             '&bu=' + encodeURIComponent(getParams['business'] ? getParams['business'] : '') ,
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 // 'X-Email': 'testtoken@timesinternet.in',
//                 'X-Email': req.get('X-Email'),
//                 // 'X-Token': 'f85307a7c73640e75cfb9af4a325f5d1f3c1583d9916cf2565a0dd2e5919a6f7',
//                 'X-Token': req.get('X-Token')
//              }
//         }
//     resolveHTTPRequest(options, req, res);
//     // res.send('{"count":639,"status":1,"vmdata":[{"OS":"CENTOS 7 (64 bit)","cpu":"4","hostname":"GANA66100","ip":"172.29.66.100","location":"mumbai","memory":"8","monitor_status":"2","monitoring_value":"2","os_image":"centos.png","progress":"100","project":"Injestion Gaana","user":"testtoken@timesinternet.in","vm_status":"up","vmtype":"BASE","vmtype_image":"centos.png"},{"OS":"CENTOS 7 (64 bit)","cpu":"8","hostname":"JSSODB138101","ip":"172.29.138.101","location":"mumbai","memory":"15","monitor_status":"2","monitoring_value":"2","os_image":"centos.png","progress":"100","project":"JSSO","user":"testtoken@timesinternet.in","vm_status":"up","vmtype":"BASE","vmtype_image":"centos.png"},{"OS":"CENTOS 7 (64 bit)","cpu":"8","hostname":"GANAAPP11123","ip":"172.26.11.123","location":"chennai","memory":"32","monitor_status":"2","monitoring_value":"2","os_image":"centos.png","progress":"100","project":"Recommendation Gaana","user":"testtoken@timesinternet.in","vm_status":"up","vmtype":"BASE","vmtype_image":"centos.png"},{"OS":"CENTOS 7 (64 bit)","cpu":"8","hostname":"GANAAPP11122","ip":"172.26.11.122","location":"chennai","memory":"32","monitor_status":"2","monitoring_value":"2","os_image":"centos.png","progress":"100","project":"Recommendation Gaana","user":"testtoken@timesinternet.in","vm_status":"up","vmtype":"BASE","vmtype_image":"centos.png"},{"OS":"CENTOS 7 (64 bit)","cpu":"8","hostname":"GANAAPP11121","ip":"172.26.11.121","location":"chennai","memory":"32","monitor_status":"2","monitoring_value":"2","os_image":"centos.png","progress":"100","project":"Recommendation Gaana","user":"testtoken@timesinternet.in","vm_status":"up","vmtype":"BASE","vmtype_image":"centos.png"},{"OS":"CENTOS 7 (64 bit)","cpu":"8","hostname":"GANAAPP11120","ip":"172.26.11.120","location":"chennai","memory":"32","monitor_status":"2","monitoring_value":"2","os_image":"centos.png","progress":"100","project":"Recommendation Gaana","user":"testtoken@timesinternet.in","vm_status":"up","vmtype":"BASE","vmtype_image":"centos.png"},{"OS":"CENTOS 7 (64 bit)","cpu":"8","hostname":"GANAAPP11119","ip":"172.26.11.119","location":"chennai","memory":"32","monitor_status":"2","monitoring_value":"2","os_image":"centos.png","progress":"100","project":"Recommendation Gaana","user":"testtoken@timesinternet.in","vm_status":"up","vmtype":"BASE","vmtype_image":"centos.png"},{"OS":"CENTOS 7 (64 bit)","cpu":"8","hostname":"GANAAPP11118","ip":"172.26.11.118","location":"chennai","memory":"32","monitor_status":"2","monitoring_value":"2","os_image":"centos.png","progress":"100","project":"Recommendation Gaana","user":"testtoken@timesinternet.in","vm_status":"up","vmtype":"BASE","vmtype_image":"centos.png"},{"OS":"CENTOS 7 (64 bit)","cpu":"8","hostname":"GANAAPP11117","ip":"172.26.11.117","location":"chennai","memory":"32","monitor_status":"2","monitoring_value":"2","os_image":"centos.png","progress":"100","project":"Recommendation Gaana","user":"testtoken@timesinternet.in","vm_status":"up","vmtype":"BASE","vmtype_image":"centos.png"},{"OS":"CENTOS 7 (64 bit)","cpu":"8","hostname":"GANAAPP11116","ip":"172.26.11.116","location":"chennai","memory":"32","monitor_status":"2","monitoring_value":"2","os_image":"centos.png","progress":"100","project":"Recommendation Gaana","user":"testtoken@timesinternet.in","vm_status":"up","vmtype":"BASE","vmtype_image":"centos.png"},{"OS":"CENTOS 7 (64 bit)","cpu":"8","hostname":"GANAAPP11115","ip":"172.26.11.115","location":"chennai","memory":"32","monitor_status":"2","monitoring_value":"2","os_image":"centos.png","progress":"100","project":"Recommendation Gaana","user":"testtoken@timesinternet.in","vm_status":"up","vmtype":"BASE","vmtype_image":"centos.png"},{"OS":"CENTOS 7 (64 bit)","cpu":"8","hostname":"GANAAPP11114","ip":"172.26.11.114","location":"chennai","memory":"32","monitor_status":"2","monitoring_value":"2","os_image":"centos.png","progress":"100","project":"Recommendation Gaana","user":"testtoken@timesinternet.in","vm_status":"up","vmtype":"BASE","vmtype_image":"centos.png"},{"OS":"CENTOS 7 (64 bit)","cpu":"8","hostname":"GANAAPP11113","ip":"172.26.11.113","location":"chennai","memory":"32","monitor_status":"2","monitoring_value":"2","os_image":"centos.png","progress":"100","project":"Recommendation Gaana","user":"testtoken@timesinternet.in","vm_status":"up","vmtype":"BASE","vmtype_image":"centos.png"},{"OS":"CENTOS 7 (64 bit)","cpu":"8","hostname":"GANAAPP11112","ip":"172.26.11.112","location":"chennai","memory":"32","monitor_status":"2","monitoring_value":"2","os_image":"centos.png","progress":"100","project":"Recommendation Gaana","user":"testtoken@timesinternet.in","vm_status":"up","vmtype":"BASE","vmtype_image":"centos.png"},{"OS":"CENTOS 7 (64 bit)","cpu":"8","hostname":"GANAAPP11111","ip":"172.26.11.111","location":"chennai","memory":"32","monitor_status":"2","monitoring_value":"2","os_image":"centos.png","progress":"100","project":"Recommendation Gaana","user":"testtoken@timesinternet.in","vm_status":"up","vmtype":"BASE","vmtype_image":"centos.png"},{"OS":"CENTOS 7 (64 bit)","cpu":"8","hostname":"GANAAPP11110","ip":"172.26.11.110","location":"chennai","memory":"32","monitor_status":"2","monitoring_value":"2","os_image":"centos.png","progress":"100","project":"Recommendation Gaana","user":"testtoken@timesinternet.in","vm_status":"up","vmtype":"BASE","vmtype_image":"centos.png"}]}');
// } catch(e){
//     console.log(options);
//     console.log(e);
// }
// })

// // Get my servers summary
// router.get('/serversummary', (req, res) => {
//     try {
//         let getParams = req.query;
//         var options = {
//             // host: '192.169.36.243',
//             host: 'autoapi.indiatimes.com',
//             path: '/api/v0.1/serversummary?' + 
//             's_count=' + getParams['s_count'] + 
//             '&e_count=' + getParams['e_count'],
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'X-Email': req.get('X-Email'),
//                 'X-Token': req.get('X-Token')
//              }
//         }
        
//     resolveHTTPRequest(options, req, res);

// } catch(e){
//     console.log(options);
//     console.log(e);
// }
// })


// // Update server data
// router.post('/servers/update', (req, res) => {
//     try {
//         var postParams = req.body;
//         var options = {
//             host: '192.169.36.243',
//             path: '/api/v0.1/updateproject', 
//             data: {
//                 projectname: postParams['projectname'] ? postParams['projectname'] : null,
//                 bu: encodeURIComponent(postParams['bu'] ? postParams['bu'] : null),
//                 env: encodeURIComponent(postParams['env'] ? postParams['env'] : null),
//                 vmid: encodeURIComponent(postParams['vmid'] ? postParams['vmid'] : null)
//             },
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'X-Email': req.get('X-Email'),
//                 'X-Token': req.get('X-Token')
//             }
//         }
//         console.log(postParams);
//         console.log(options);
//         var handleResponse = function(data) {
//             res.json(data);
//         }
//         resolveHTTPRequest(options, req, res, handleResponse);
 
//  } catch(e){
//     console.log(options);
//     console.log(e);
// }
// })

// Update server data
router.post('/servers/update', (req, res) => {
    try {
        var postParams = req.body;
        console.log(postParams);
        request({
            method: 'POST',
            url: 'http://autoapi.indiatimes.com/api/v0.1/updateproject',
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
        let zoneUrl = '';
        if(dcZone){
            if(dcZone === 'TIL-MUM-Zone') {
                zoneUrl = 'http://172.29.102.101:5000/api/v0.1/createcluster';
            } else if(dcZone === 'TIL-CHN-Zone') {
                zoneUrl = 'http://192.169.33.123:5000/api/v0.1/createcluster';
            }
        }
        request({
            method: 'POST',
            // url: 'http://192.169.33.123/api/v0.1/vmprovision',
            url: zoneUrl,
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
            console.log(error);
            // console.log(response);
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
            host: '192.168.33.212',
            port: 5000,
            path: '/api/v0.1/getrdmmap?' + 
            'username=' + encodeURIComponent(req.get('X-Email') ? req.get('X-Email') : '') +
            '&searchvalue=' + encodeURIComponent(getParams['search_value'] ? getParams['search_value'] : '') +
            '&s_count=' + encodeURIComponent(getParams['start_count'] ? getParams['start_count'] : '0') + 
            '&e_count=16' + 
            '&project=' +  encodeURIComponent(getParams['project'] ? getParams['project'] : '') +
            '&env=' + encodeURIComponent(getParams['env'] ? getParams['env'] : '') +
            '&location=' + encodeURIComponent(getParams['location'] ? getParams['location'] : '') +
            '&status=' + encodeURIComponent(getParams['status'] ? getParams['status'] : '1') +
            '&vmtype=' + encodeURIComponent(getParams['vm_type'] ? getParams['vm_type'] : '') +
            '&bu=' + encodeURIComponent(getParams['business'] ? getParams['business'] : '') ,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Email': req.get('X-Email'),
                'X-Token': req.get('X-Token')
            }
        }
        console.log(options);
        var handleResponse = function(jsonData) {
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
            res.json(jsonData);
        }

        resolveHTTPRequest(options, req, res, handleResponse);
        
    // res.send('{"count":639,"status":1,"vmdata":[{"OS":"CENTOS 7 (64 bit)","cpu":"4","hostname":"GANA66100","ip":"172.29.66.100","location":"mumbai","memory":"8","monitor_status":"2","monitoring_value":"2","os_image":"centos.png","progress":"100","project":"Injestion Gaana","user":"testtoken@timesinternet.in","vm_status":"up","vmtype":"BASE","vmtype_image":"centos.png"},{"OS":"CENTOS 7 (64 bit)","cpu":"8","hostname":"JSSODB138101","ip":"172.29.138.101","location":"mumbai","memory":"15","monitor_status":"2","monitoring_value":"2","os_image":"centos.png","progress":"100","project":"JSSO","user":"testtoken@timesinternet.in","vm_status":"up","vmtype":"BASE","vmtype_image":"centos.png"},{"OS":"CENTOS 7 (64 bit)","cpu":"8","hostname":"GANAAPP11123","ip":"172.26.11.123","location":"chennai","memory":"32","monitor_status":"2","monitoring_value":"2","os_image":"centos.png","progress":"100","project":"Recommendation Gaana","user":"testtoken@timesinternet.in","vm_status":"up","vmtype":"BASE","vmtype_image":"centos.png"},{"OS":"CENTOS 7 (64 bit)","cpu":"8","hostname":"GANAAPP11122","ip":"172.26.11.122","location":"chennai","memory":"32","monitor_status":"2","monitoring_value":"2","os_image":"centos.png","progress":"100","project":"Recommendation Gaana","user":"testtoken@timesinternet.in","vm_status":"up","vmtype":"BASE","vmtype_image":"centos.png"},{"OS":"CENTOS 7 (64 bit)","cpu":"8","hostname":"GANAAPP11121","ip":"172.26.11.121","location":"chennai","memory":"32","monitor_status":"2","monitoring_value":"2","os_image":"centos.png","progress":"100","project":"Recommendation Gaana","user":"testtoken@timesinternet.in","vm_status":"up","vmtype":"BASE","vmtype_image":"centos.png"},{"OS":"CENTOS 7 (64 bit)","cpu":"8","hostname":"GANAAPP11120","ip":"172.26.11.120","location":"chennai","memory":"32","monitor_status":"2","monitoring_value":"2","os_image":"centos.png","progress":"100","project":"Recommendation Gaana","user":"testtoken@timesinternet.in","vm_status":"up","vmtype":"BASE","vmtype_image":"centos.png"},{"OS":"CENTOS 7 (64 bit)","cpu":"8","hostname":"GANAAPP11119","ip":"172.26.11.119","location":"chennai","memory":"32","monitor_status":"2","monitoring_value":"2","os_image":"centos.png","progress":"100","project":"Recommendation Gaana","user":"testtoken@timesinternet.in","vm_status":"up","vmtype":"BASE","vmtype_image":"centos.png"},{"OS":"CENTOS 7 (64 bit)","cpu":"8","hostname":"GANAAPP11118","ip":"172.26.11.118","location":"chennai","memory":"32","monitor_status":"2","monitoring_value":"2","os_image":"centos.png","progress":"100","project":"Recommendation Gaana","user":"testtoken@timesinternet.in","vm_status":"up","vmtype":"BASE","vmtype_image":"centos.png"},{"OS":"CENTOS 7 (64 bit)","cpu":"8","hostname":"GANAAPP11117","ip":"172.26.11.117","location":"chennai","memory":"32","monitor_status":"2","monitoring_value":"2","os_image":"centos.png","progress":"100","project":"Recommendation Gaana","user":"testtoken@timesinternet.in","vm_status":"up","vmtype":"BASE","vmtype_image":"centos.png"},{"OS":"CENTOS 7 (64 bit)","cpu":"8","hostname":"GANAAPP11116","ip":"172.26.11.116","location":"chennai","memory":"32","monitor_status":"2","monitoring_value":"2","os_image":"centos.png","progress":"100","project":"Recommendation Gaana","user":"testtoken@timesinternet.in","vm_status":"up","vmtype":"BASE","vmtype_image":"centos.png"},{"OS":"CENTOS 7 (64 bit)","cpu":"8","hostname":"GANAAPP11115","ip":"172.26.11.115","location":"chennai","memory":"32","monitor_status":"2","monitoring_value":"2","os_image":"centos.png","progress":"100","project":"Recommendation Gaana","user":"testtoken@timesinternet.in","vm_status":"up","vmtype":"BASE","vmtype_image":"centos.png"},{"OS":"CENTOS 7 (64 bit)","cpu":"8","hostname":"GANAAPP11114","ip":"172.26.11.114","location":"chennai","memory":"32","monitor_status":"2","monitoring_value":"2","os_image":"centos.png","progress":"100","project":"Recommendation Gaana","user":"testtoken@timesinternet.in","vm_status":"up","vmtype":"BASE","vmtype_image":"centos.png"},{"OS":"CENTOS 7 (64 bit)","cpu":"8","hostname":"GANAAPP11113","ip":"172.26.11.113","location":"chennai","memory":"32","monitor_status":"2","monitoring_value":"2","os_image":"centos.png","progress":"100","project":"Recommendation Gaana","user":"testtoken@timesinternet.in","vm_status":"up","vmtype":"BASE","vmtype_image":"centos.png"},{"OS":"CENTOS 7 (64 bit)","cpu":"8","hostname":"GANAAPP11112","ip":"172.26.11.112","location":"chennai","memory":"32","monitor_status":"2","monitoring_value":"2","os_image":"centos.png","progress":"100","project":"Recommendation Gaana","user":"testtoken@timesinternet.in","vm_status":"up","vmtype":"BASE","vmtype_image":"centos.png"},{"OS":"CENTOS 7 (64 bit)","cpu":"8","hostname":"GANAAPP11111","ip":"172.26.11.111","location":"chennai","memory":"32","monitor_status":"2","monitoring_value":"2","os_image":"centos.png","progress":"100","project":"Recommendation Gaana","user":"testtoken@timesinternet.in","vm_status":"up","vmtype":"BASE","vmtype_image":"centos.png"},{"OS":"CENTOS 7 (64 bit)","cpu":"8","hostname":"GANAAPP11110","ip":"172.26.11.110","location":"chennai","memory":"32","monitor_status":"2","monitoring_value":"2","os_image":"centos.png","progress":"100","project":"Recommendation Gaana","user":"testtoken@timesinternet.in","vm_status":"up","vmtype":"BASE","vmtype_image":"centos.png"}]}');
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
            // host: '192.169.36.243',
            host: 'autoapi.indiatimes.com',
            port: 5000,
            path: '/api/v0.1/viplist?' + 
            'username=' + encodeURIComponent(postParams['email'] ? postParams['email'] : '') +
            '&searchvalue=' + encodeURIComponent(postParams['search_value'] ? postParams['search_value'] : '') +
            '&s_count=' + encodeURIComponent(postParams['start_count'] ? postParams['start_count'] : '0') + 
            '&e_count=16' + 
            '&project=' +  encodeURIComponent(postParams['project'] ? postParams['project'] : '') +
            '&env=' + encodeURIComponent(postParams['env'] ? postParams['env'] : '') +
            '&location=' + encodeURIComponent(postParams['location'] ? postParams['location'] : '') +
            '&health=' + encodeURIComponent(postParams['health'] ? postParams['health'] : '1') +
            '&range=' + encodeURIComponent(postParams['range'] ? postParams['range'] : '') +
            '&port=' + encodeURIComponent(postParams['port'] ? postParams['port'] : '') +
            '&bu=' + encodeURIComponent(postParams['business'] ? postParams['business'] : '') ,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Email': postParams['email'],
                'X-Token': postParams['token']
            }
        }
        resolveHTTPRequest(options, req, res);

    // res.send('{"count":639,"status":1,"vmdata":[{"OS":"CENTOS 7 (64 bit)","cpu":"4","hostname":"GANA66100","ip":"172.29.66.100","location":"mumbai","memory":"8","monitor_status":"2","monitoring_value":"2","os_image":"centos.png","progress":"100","project":"Injestion Gaana","user":"testtoken@timesinternet.in","vm_status":"up","vmtype":"BASE","vmtype_image":"centos.png"},{"OS":"CENTOS 7 (64 bit)","cpu":"8","hostname":"JSSODB138101","ip":"172.29.138.101","location":"mumbai","memory":"15","monitor_status":"2","monitoring_value":"2","os_image":"centos.png","progress":"100","project":"JSSO","user":"testtoken@timesinternet.in","vm_status":"up","vmtype":"BASE","vmtype_image":"centos.png"},{"OS":"CENTOS 7 (64 bit)","cpu":"8","hostname":"GANAAPP11123","ip":"172.26.11.123","location":"chennai","memory":"32","monitor_status":"2","monitoring_value":"2","os_image":"centos.png","progress":"100","project":"Recommendation Gaana","user":"testtoken@timesinternet.in","vm_status":"up","vmtype":"BASE","vmtype_image":"centos.png"},{"OS":"CENTOS 7 (64 bit)","cpu":"8","hostname":"GANAAPP11122","ip":"172.26.11.122","location":"chennai","memory":"32","monitor_status":"2","monitoring_value":"2","os_image":"centos.png","progress":"100","project":"Recommendation Gaana","user":"testtoken@timesinternet.in","vm_status":"up","vmtype":"BASE","vmtype_image":"centos.png"},{"OS":"CENTOS 7 (64 bit)","cpu":"8","hostname":"GANAAPP11121","ip":"172.26.11.121","location":"chennai","memory":"32","monitor_status":"2","monitoring_value":"2","os_image":"centos.png","progress":"100","project":"Recommendation Gaana","user":"testtoken@timesinternet.in","vm_status":"up","vmtype":"BASE","vmtype_image":"centos.png"},{"OS":"CENTOS 7 (64 bit)","cpu":"8","hostname":"GANAAPP11120","ip":"172.26.11.120","location":"chennai","memory":"32","monitor_status":"2","monitoring_value":"2","os_image":"centos.png","progress":"100","project":"Recommendation Gaana","user":"testtoken@timesinternet.in","vm_status":"up","vmtype":"BASE","vmtype_image":"centos.png"},{"OS":"CENTOS 7 (64 bit)","cpu":"8","hostname":"GANAAPP11119","ip":"172.26.11.119","location":"chennai","memory":"32","monitor_status":"2","monitoring_value":"2","os_image":"centos.png","progress":"100","project":"Recommendation Gaana","user":"testtoken@timesinternet.in","vm_status":"up","vmtype":"BASE","vmtype_image":"centos.png"},{"OS":"CENTOS 7 (64 bit)","cpu":"8","hostname":"GANAAPP11118","ip":"172.26.11.118","location":"chennai","memory":"32","monitor_status":"2","monitoring_value":"2","os_image":"centos.png","progress":"100","project":"Recommendation Gaana","user":"testtoken@timesinternet.in","vm_status":"up","vmtype":"BASE","vmtype_image":"centos.png"},{"OS":"CENTOS 7 (64 bit)","cpu":"8","hostname":"GANAAPP11117","ip":"172.26.11.117","location":"chennai","memory":"32","monitor_status":"2","monitoring_value":"2","os_image":"centos.png","progress":"100","project":"Recommendation Gaana","user":"testtoken@timesinternet.in","vm_status":"up","vmtype":"BASE","vmtype_image":"centos.png"},{"OS":"CENTOS 7 (64 bit)","cpu":"8","hostname":"GANAAPP11116","ip":"172.26.11.116","location":"chennai","memory":"32","monitor_status":"2","monitoring_value":"2","os_image":"centos.png","progress":"100","project":"Recommendation Gaana","user":"testtoken@timesinternet.in","vm_status":"up","vmtype":"BASE","vmtype_image":"centos.png"},{"OS":"CENTOS 7 (64 bit)","cpu":"8","hostname":"GANAAPP11115","ip":"172.26.11.115","location":"chennai","memory":"32","monitor_status":"2","monitoring_value":"2","os_image":"centos.png","progress":"100","project":"Recommendation Gaana","user":"testtoken@timesinternet.in","vm_status":"up","vmtype":"BASE","vmtype_image":"centos.png"},{"OS":"CENTOS 7 (64 bit)","cpu":"8","hostname":"GANAAPP11114","ip":"172.26.11.114","location":"chennai","memory":"32","monitor_status":"2","monitoring_value":"2","os_image":"centos.png","progress":"100","project":"Recommendation Gaana","user":"testtoken@timesinternet.in","vm_status":"up","vmtype":"BASE","vmtype_image":"centos.png"},{"OS":"CENTOS 7 (64 bit)","cpu":"8","hostname":"GANAAPP11113","ip":"172.26.11.113","location":"chennai","memory":"32","monitor_status":"2","monitoring_value":"2","os_image":"centos.png","progress":"100","project":"Recommendation Gaana","user":"testtoken@timesinternet.in","vm_status":"up","vmtype":"BASE","vmtype_image":"centos.png"},{"OS":"CENTOS 7 (64 bit)","cpu":"8","hostname":"GANAAPP11112","ip":"172.26.11.112","location":"chennai","memory":"32","monitor_status":"2","monitoring_value":"2","os_image":"centos.png","progress":"100","project":"Recommendation Gaana","user":"testtoken@timesinternet.in","vm_status":"up","vmtype":"BASE","vmtype_image":"centos.png"},{"OS":"CENTOS 7 (64 bit)","cpu":"8","hostname":"GANAAPP11111","ip":"172.26.11.111","location":"chennai","memory":"32","monitor_status":"2","monitoring_value":"2","os_image":"centos.png","progress":"100","project":"Recommendation Gaana","user":"testtoken@timesinternet.in","vm_status":"up","vmtype":"BASE","vmtype_image":"centos.png"},{"OS":"CENTOS 7 (64 bit)","cpu":"8","hostname":"GANAAPP11110","ip":"172.26.11.110","location":"chennai","memory":"32","monitor_status":"2","monitoring_value":"2","os_image":"centos.png","progress":"100","project":"Recommendation Gaana","user":"testtoken@timesinternet.in","vm_status":"up","vmtype":"BASE","vmtype_image":"centos.png"}]}');
} catch(e){
    console.log(options);
    console.log(e);
}
})

// Get list of my business and costs
router.get('/getprojectwisecost', (req, res) => {

    try {
        // return res.send('{"status": 1,"totalresult": 4, "result": [{"BU":"Gaana","totalcost": 1234234234,"VMCOUNT":17,"physical":10},{"BU":"Ad Tech","totalcost": 1234234234,"VMCOUNT":17,"physical":10},{"BU":"AdSales","totalcost": 122344,"VMCOUNT":17,"physical":10}]}');
        let getParams = req.query;
        var options = {
            host: 'assets.timesinternet.in',
            path: '/v1/api/getprojectwisecost?' + 
            'costtype=' + getParams['costtype'] + 
            '&year=' + getParams['year'] + 
            '&start=' + getParams['start'] + 
            '&limit=' + getParams['limit'] + 
            '&bu_value=' + encodeURIComponent(getParams['bu_value']) + 
            '&project_value=' + encodeURIComponent(getParams['project_value'] ? getParams['project_value'] : null) + 
            '&month=' + getParams['month'],
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Email': req.get('X-Email'),
                'X-Token': req.get('X-Token')
             }
        }
        
    resolveHTTPRequest(options, req, res);

} catch(e){
    console.log(options);
    console.log(e);
}
})


function resolveHTTPRequest(options, req, res, callback) {
    var httpRequest = http.request(options, function(externalResponse) {
        let data = '';
        externalResponse.on('data', function(chunk){
            data += chunk;

        });

        externalResponse.on('end', function(){
             // console.log(data);
             let jsonData = null; 
             try {
                try {
                    jsonData = JSON.parse(data);
                } catch (e) {
                    console.log(options);
                    console.log(data);
                }
                if (callback) { 
                    callback(jsonData);
                } else { 
                    res.json(jsonData);
                }
            } catch (e) {
                console.log(options);
                console.log(e);
            }
        })

    });

    httpRequest.on('error', function(e) {
        console.log(options);
        console.log(e);
    })

    httpRequest.end();
}

module.exports = router;