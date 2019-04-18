'use strict';

module.exports = {
    middleware(app, env) {
        return (req, res, next) => {
            Object.assign(res.locals, app.locals);
            res.locals.translate = (key, options) => {
                options = options || {};
                let txt = req.translate ? req.translate(key, options) : key;
                if (txt === false || txt === undefined || txt === null) return;
                if (options.noRender) return txt;
                let context = options.context || res.locals;
                if (Array.isArray(txt)) {
                    return txt.map(item => env.renderString(String(item), context));
                }
                return env.renderString(String(txt), context);
            };
            res.locals.ctx = key => key ? key.split('.').reduce((a, k) => a && a[k], res.locals) : res.locals;
            next();
        };
    }
};
