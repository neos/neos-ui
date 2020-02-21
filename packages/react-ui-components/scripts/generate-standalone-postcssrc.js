const styles = require('../../build-essentials/src/styles/styleConstants');
const styleVars = styles.generateCssVarsObject(styles.config);

const postcssRc = {
    "modules": true,
    "plugins": {
        "autoprefixer": {},
        // "postcss-css-variables" will EAT css class names with two dashes...
        // so we will use "postcss-custom-properties" instead, which works properly.
        "postcss-custom-properties": {
            preserve: false,
            importFrom: [
                {
                    customProperties: styleVars
                }
            ]
        },
        "postcss-import": {},
        "postcss-nested": {},
        'postcss-hexrgba': {}
    }
};

const fs = require('fs');
fs.writeFileSync(__dirname + '/../.postcssrc', JSON.stringify(postcssRc, null, 4));
