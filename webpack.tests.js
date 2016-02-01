const context = require.context('./Resources/Private/JavaScript', true, /.spec\.js$/);

context.keys().forEach(context);
