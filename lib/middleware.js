'use strict';

module.exports = (req, res, next) => {
    res.locals.ctx = key => key ? key.split('.').reduce((a, k) => a && a[k], res.locals) : res.locals;
    next();
};
