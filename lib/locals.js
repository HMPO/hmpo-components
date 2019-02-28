'use strict';

module.exports = {
    middleware(env) {
        return (req, res, next) => {
            res.locals.translate = (key, options) => {
                options = options || {};
                let txt = req.translate ? req.translate(key, options) : key;
                if (typeof txt !== 'string') return;
                if (options.noRender) return txt;
                let context = options.context || res.locals;
                return env.renderString(txt, context);
            };
            res.locals.ctx = key => key ? key.split('.').reduce((a, k) => a && a[k], res.locals) : res.locals;
            next();
        };
    }
};
