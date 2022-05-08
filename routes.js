const routes = require('next-routes')();

routes
	.add('/campaigns/new', '/campaigns/new')
	.add('/campaigns/MyDocument', '/campaigns/MyDocument')
	.add('/campaigns/:address', '/campaigns/show');

module.exports = routes;
