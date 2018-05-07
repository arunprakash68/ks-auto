const rp = require('request-promise');

function resolveHTTPRequestPromise(options, req, res, callbackFlag) {
	try {
		if(callbackFlag) {
			return rp(options);
		}

		let jsonData = null;
		rp(options)
		.then(function(data){
			res.json(data);
		})
		.catch(function(error){
			res.status(error.statusCode ? error.statusCode : 500);
			res.send(error);
		});

	} catch(e) {
		console.log(options);
		console.log(e);
	}
	return null;
}

module.exports.resolveHTTPRequestPromise = resolveHTTPRequestPromise;