'use strict';

const filters = require('./lib/filters');
const globals = require('./lib/globals');
const locals = require('./lib/locals');
const mixins = require('./lib/mixins');

module.exports = {
    setup: (app, env) => {
        filters.addFilters(env);
        globals.addGlobals(env);
        app.use(locals.middleware(app, env));
    },
    mixins
};
