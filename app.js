/**
 * NOTE: this file is simply for testing your Connector and
 * not used or packaged with the actual connector when published
 */
var APIBuilder = require('appcelerator').apibuilder,
	server = new APIBuilder(),
	connector = server.getConnector('appc.salesforce');

// lifecycle examples
server.on('starting', function(){
	server.logger.info('server is starting!');
});

server.on('started', function(){
	server.logger.info('server started!');
});

//--------------------- implement authorization ---------------------//

// fetch our configured apikey
var apikey = server.get('apikey');
server.logger.info('APIKey is:',apikey);

function APIKeyAuthorization(req, resp, next) {
	if (!apikey) return next();
	if (req.headers['apikey']) {
		var key = req.headers['apikey'];
		if (key == apikey) {
			return next();
		}
	}
	resp.status(401);
	return resp.json({
		id: "com.appcelerator.api.unauthorized",
		message: "Unauthorized",
		url: ""
	});
}

//--------------------- simple user model ---------------------//

var Account = APIBuilder.Model.extend('Account',{
	fields: {
		Name: { type: String, required: false, validator: /[a-zA-Z]{3,}/ },
		Type: { type: String, readonly: true },
		AccountSource: { type: String }
	},
	connector: 'appc.salesforce'
});

// create a user api from a user model
server.addModel(Account);

// add an authorization policy for all requests at the server log
server.authorization = APIKeyAuthorization;

// start the server
server.start(function(err) {
	if (err) {
		return server.logger.fatal(err);
	}
	server.logger.info('server started on port', server.port);
	connector.fetchSchema(function(err,schema){
		server.logger.info('server fetched schema');
		err && server.logger.error(err);
	});
});
