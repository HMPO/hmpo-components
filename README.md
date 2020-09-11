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

## Components

Components can be called as macros:
```
{% from "hmpo-input/macro.njk" import hmpoInput %}
{% from "hmpo-submit/macro.njk" import hmpoSubmit %}

{{ hmpoInput(ctx, { id: "fieldId" }) }}
{{ hmpoSubmit(ctx, { key: "textKey" }) }}
```

### Available form wizard components:
```
hmpoForm(ctx, params)
hmpoErrorGroup(ctx, params)
hmpoAutoSubmit(ctx, params)
hmpoSubmit(ctx, params)

hmpoCheckboxes(ctx, params);
hmpoDate(ctx, params)
hmpoNumber(ctx, params)
hmpoPhone(ctx, params)
hmpoRadios(ctx, params)
hmpoSelect(ctx, params)
hmpoText(ctx, params)
hmpoTextarea(ctx, params)
```

### Field parameters
Most govuk-frontend parameters can be specified in the fields config, or supplied to the component directly.
Label, hint, and legend text is loaded from localisation using a default key structure unless overridden.

- `label.key`: overridden label key.
- `legend.key`: overridden legend key.
- `hint.key`: overridden hint key
- `items`: Array of select box, radio, or checkbox options, or an Array of govuk item objects.
- `legend`: Applicable to `radio` button controls, which are wrapped in a HTML `fieldset` with a `legend` element.

### Other available components:
```
hmpoCharsLeft(params);
hmpoCircleStep(params);
hmpoCircleStepList(params);
hmpoClose(params);
hmpoCookieBanner(params);
hmpoDetails(params)
hmpoFlashCard(params)
hmpoFooter(params)
hmpoInsetText(params)
hmpoPrintPage(params)
hmpoSidebar(params)
hmpoWarningText(params)
```

### Helper and formatting components:
```
hmpoHtml(obj)
```

## Filters

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
filter
```

### `date` filter

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

### `time` filter

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

## Controller mixins

Use the controller mixins to extend the base wizard controller:
```
const BaseController = require('hmpo-form-wizard').Controller;
const DateControllerMixin = require('hmpo-components').mixins.Date;

const DateController = DateControllerMixin(BaseController);

class MyController extends DateController {    
}
```

## DateController mixin

The `DateController` mixin adds day, month, and year fields for a YYYY-MM-DD date field so the `hmpoDate` component can be validated and processed properly.

The date field must use the `date` validator to use this functionality.

Additional validation errors can be produced and need localisation, for example:

```
"validation": {
    "date": "Enter a complete {{label}}",
    "date-year": "Enter a valid year",
    "date-month": "Enter a valid month",
    "date-day": "Enter a valid day",

    "required-day": "Enter a complete {{label}}",
    "required-month": "Enter a complete {{label}}",
    "required-year": "Enter a complete {{label}}",

    "numeric-year": "Enter a year using numbers only",
    "numeric-month": "Enter a month using numbers only",
    "numeric-day": "Enter a day using numbers only",
}
```

## Breaking changes

### 3.0.0

- The error summary now links to the form field causing the error instead of the error text div. You can add a `field` parameter to custom errors to an error to override the link.
- The first item in a set of radio buttons or checkboxes will now have the id set to _fieldname_ instead of _fieldname_-_value_.
