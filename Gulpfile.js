var build = require('./Build/Gulp/Index.js');

// Add package your configurations here.
// The tasks for each package will be automatically created.
build.addPackages([
    require('./BuildConfig.js')
]);
