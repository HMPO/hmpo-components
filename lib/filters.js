'use strict';

const debug = require('debug')('hmpo:components:filters');

const path = require('path').posix;
const moment = require('moment');

let filters = {
    currency(value, { currencySymbol = '£', zeroValue }) {
        value = parseFloat(value);
        if (isNaN(value)) {
            return value;
        } else if (zeroValue !== undefined && value === 0) {
            return zeroValue;
        } else if (value % 1 === 0) {
            value = value.toString();
        } else {
            value = value.toFixed(2);
        }
        return currencySymbol + value;
    },

    currencyOrFree(value) {
        return filters.currency().call(this, value, { zeroValue: filters.translate().call(this, 'free') });
    },

    date(txt, format = 'D MMMM YYYY') {
        return moment(txt).format(format);
    },

    hyphenate(txt) {
        return txt.trim().toLowerCase().replace(/\s+/g, '-');
    },

    uppercase(txt) {
        return txt.toUpperCase();
    },

    lowercase(txt) {
        return txt.toLowerCase();
    },

    capscase(txt) {
        return txt.substr(0, 1).toUpperCase() + txt.substr(1);
    },

    /**
    * Use on whole sentences
    */
    time(value, { short, midnight, midday } = { short: true, midnight: true, midday: true }) {
        if (midnight) {
            value = value.replace(/12:00am/ig, 'midnight');
            value = value.replace(/^midnight/, 'Midnight');
        }
        if (midday) {
            value = value.replace(/12:00pm/ig, 'midday');
            value = value.replace(/^midday/, 'Midday');
        }
        if (short) {
            value = value.replace(/:00(am|pm)/ig, '$1');
        }
        return value;
    },

    translate(txt, options) {
        return this.ctx.translate ? this.ctx.translate(txt, options) : txt;
    },

    jsonStringify(obj) {
        return JSON.stringify(obj, null, 2);
    },

    url(url) {
        return this.ctx.baseUrl ? path.resolve(this.ctx.baseUrl, url) : url;
    }
};

let addFilters = env => {
    debug('adding filters');
    for (let name in filters) env.addFilter(name, filters[name]);
};

module.exports = {
    filters,
    addFilters
};
