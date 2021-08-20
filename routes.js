const routes = require('next-routes')();

// The : indicates the beginning of a wildcard (like in Postman), however, we need to be careful
// on the wildcard since if we want to go to /campaigns/new then 'new' is going to be matched as
// a wildcard as well.


// Second argument match the folder structure
routes
    .add('/campaigns/new', '/campaigns/new')
    .add('/campaigns/:address', '/campaigns/show')
    .add('/campaigns/:address/requests', '/campaigns/requests/index')
    .add('/campaigns/:address/requests/new', '/campaigns/requests/new');

module.exports = routes;
