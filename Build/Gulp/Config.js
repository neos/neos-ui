module.exports = {
    // Empty tasks array which will be filled with the aviable taskNames on each gulp run.
    'tasks': [],

    // Project related settings, switching the 'isInLiveMode' bool to true, minifies the assets on each build/compile task run.
    'project': {
        'isInLiveMode': false,
        'browserSupport': ['last 2 versions', 'ie 9']
    },

    // Configuration for https://github.com/doctyper/gulp-modernizr
    'modernizr': {
        'fileName': 'Modernizr.min.js',
        'destPath': 'Dist/JavaScript/',
        'config': {

            // Based on default settings of http://modernizr.com/download/
            'options': [
                'setClasses',
                'addTest',
                'html5printshiv',
                'testProp',
                'fnBind'
            ]
        }
    }
};
