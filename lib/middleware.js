'use strict';

module.exports = (env) => {
    return (req, res, next) => {
        res.translate = (txt, options) => {
            txt = req.translate ? req.translate(txt, options) : txt;
            return options.noRender ? env.renderString(txt, options.ctx || res.locals) : txt;
        };
        res.locals.ctx = key => key ? key.split('.').reduce((a, k) => a && a[k], res.locals) : res.locals;
        next();
    };
};
