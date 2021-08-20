const routes = require('next-routes')();

// The : indicates the beginning of a wildcard (like in Postman), however, we need to be careful
// on the wildcard since if we want to go to /campaigns/new then 'new' is going to be matched as
// a wildcard as well
routes
    .add('/campaigns/new', '/campaigns/new')
    .add('/campaigns/:address', '/campaigns/show');

module.exports = routes;
