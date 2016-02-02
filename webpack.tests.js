//
// This file serves as the main entry file for karma.
// It will require all files ending with `.spec.js`
// and compile them with webpack on the fly.
//
const context = require.context('./Resources/Private/JavaScript', true, /.spec\.js$/);

context.keys().forEach(context);
