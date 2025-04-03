# @neos-project/neos-ui-error

> Dedicated package for handling all kinds of errors in the Neos UI

This package provides utilities to analyze errors of various types. It provides the `<ErrorView/>` component that can be embedded in other components to display those errors. In `FLOW_CONTEXT=Development` the `<ErrorView/>` component will also display meta information (e.g. exception class name, stack trace, etc.).

Here's a list of what kind of error this package can handle:

## ECMAScript Errors

Any error that extends the built-in `Error` type in ECMAScript will be treated as an ECMAScript Error. These errors provide a stack trace that will be displayed in `FLOW_CONTEXT=Development`.

## Server-side Errors

If a PHP exception occurs in one of the Neos UI backend services, we ideally receive a JSON-serialized version of that exception as a response:
```json
{
  "error": {
    "class": "InvalidArgumentException",
    "code": 1711032895,
    "message": "Invalid node aggregate identifier \"Foo Bar\"",
    "trace": "..."
  }
}
```

These errors too provide a stack trace that will be displayed in `FLOW_CONTEXT=Development`.

## String Errors

In ECMAScript it is possible to do this:
```js
throw 'Yes, we can throw arbitrary strings in ECMAScript';
```

We never do this ourselves, but it may happen that a third-party library does it. This package is prepared to handle those cases as well.

## Unknown Errors

Any other value will be treated as an unknown error. In the UI, we cannot offer any meta information about those errors, not even an error message.

