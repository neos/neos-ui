var paths = {
  src: 'Resources/Private/',
  dest: 'Resources/Public/'
}
module.exports = {
    'name': 'ssc',
    'basePath': './',
    'sass': {
        'src': paths.src + 'Sass/',
        'dest': paths.dest + 'Styles/',
        'filePattern': '**/*.scss',
        'settings': {
            'imagePath': '../Images'
        }
    },

    'images': {
        'src': paths.src + 'Images/',
        'dest': paths.dest + 'Images/',
        'filePattern': '**/*.{png,jpg,gif,svg}',
        'settings': {
            'progressive': true,
            'svgoPlugins': [{
                'removeViewBox': false
            }]
        }
    },

    'scripts': {
        'src': paths.src + 'JavaScript/',
        'dest': paths.dest + 'JavaScript/',
        'filePattern': ['**/*.js', '!Vendor/**/*.js'],
        'bundles': [
            {
                'name': 'host',
                'src': 'Host/index.js',
                'dest': 'Host.min.js',
                'settings': {
                    'transforms': [
                        { name: 'babelify', options: {stage: 0} }
                    ]
                }
            },
            {
                'name': 'guest',
                'src': 'Guest/index.js',
                'dest': 'Guest.min.js',
                'settings': {
                    'transforms': [
                        { name: 'babelify', options: {stage: 0} }
                    ]
                }
            }
        ]
    }
};
