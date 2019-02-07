# passports-components
Nunjucks components and filters for building gov.uk pages with hmpo-form-wizard

## Installation

```javascript
npm install [--save] hmpo-components;
```

## Usage

```javascript
const path = require('path');
const express = require('express');
const i18n = require('hmpo-i18n');
const hmpoComponents = require('hmpo-template-components');

let views = [
    path.resolve(__dirname, 'views'),
    path.resolve(__dirname, 'node_modules', 'hmpo-components', 'components'),
    path.resolve(__dirname, 'node_modules', 'govuk-frontend'),
    path.resolve(__dirname, 'node_modules', 'govuk-frontend', 'components')
];

let nunjucksEnv = nunjucks.configure(views, { express: app });
i18n.middleware(app);
hmpoComponents.setup(app, nunjucksEnv);

app.set('view engine', 'html');

app.use(function (req, res) {
    res.render('mytemplate');
});
```

If rendering as part of an HMPO controller's middleware chain then the field configuration will automatically be set to `res.locals.options.fields` by the controller, and will be loaded from here by the components

## Translation

Translation is performed using a `req.translate` local function, for example as provided by [hmpo-i18n](https://npmjs.com/package/hmpo-i18n)

## filters

```
translate
selected
lowercase
uppercase
capscase
hyphenate
date
time
currency
currencyOrFree
url
```
## compnents

hmpoSelect
hmpoText
hmpoNumber
hmpoPhone
hmpoRadios
hmpoCheckboxes
hmpoSubmit
hmpoTextarea
hmpoDate
```

## Field options
Most govuk-frontend parameters can be specified in the fields config, or supplied to the component.
Label, hint, and legend text is loaded from localisation using a default key structure unless overridden.

- `label.key`: overridden label key.
- `legend.key`: overridden legend key.
- `hint.key`: overridden hint key
- `items`: Array of select box, radio, or checkbox options, or an Array of govuk item objects.
- `legend`: Applicable to `radio` button controls, which are wrapped in a HTML `fieldset` with a `legend` element.

## `date` filter

Dates should be provided a a format that moment can decode, such as ISO String format, moment object, or epoch milliseconds.
```
{{ "2017-06-03T12:34:56.000Z" | date }}
3 June 2017
```

A moment format can be supplied. The default format is D MMMM YYYY.
```
{{ "2017-06-3T12:34:56.000Z" | date("DD MMM YYYY HH:MMa") }}
03 Jun 2017 12:34pm
```

## `time` filter

The time formatter wraps a formatted time to correct for GDS standard:
```
{{ "3:00pm" | time }}
3pm

{{ "11 May 2017 at 12:00pm" | time }}
11 May 2017 at midday

{{ "12:00am" | time }}
Midnight
```

Options can be provided to only do transforms for midday, midnight, or shortened time:
```
{{ "12:00pm" | time({ short: true, midnight: true, midnight: false }) }}
12pm
```

