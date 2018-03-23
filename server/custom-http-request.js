const http = require('http');

function resolveHTTPRequest(options, req, res, callback) {
    var httpRequest = http.request(options, function(externalResponse) {
        let data = '';
        externalResponse.on('data', function(chunk){
            data += chunk;

        });

        externalResponse.on('end', function(){
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
        });
    });

    httpRequest.on('error', function(e) {
        console.log(options);
        console.log(e);
    })

    httpRequest.end();
}

module.exports.resolveHTTPRequest = resolveHTTPRequest;