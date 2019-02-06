'use strict';

const addFilters = require('./lib/filters').addFilters;
const addGlobals = require('./lib/globals').addGlobals;
const middleware = require('./lib/middleware');
const mixins = require('./lib/mixins');

module.exports = {
    addFilters,
    addGlobals,
    middleware,
    setup: (app, env) => {
        addFilters(env);
        addGlobals(env);
        app.use(middleware);
    },
    mixins
};
