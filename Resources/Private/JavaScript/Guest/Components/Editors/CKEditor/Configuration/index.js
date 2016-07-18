import merge from 'lodash.merge';
import {logger} from 'Shared/Utilities/';

//
// Fallback values for inline editor configuration
//
const DEFAULT_CONFIGURATION = {
    placeholder: '',
    formats: {
        p: false,
        h1: false,
        h2: false,
        h3: false,
        h4: false,
        h5: false,
        h6: false,
        pre: false,
        removeFormat: false,
        bold: false,
        italic: false,
        underline: false,
        sub: false,
        sup: false,
        del: false,
        ol: false,
        ul: false,
        alignLeft: false,
        alignRight: false,
        alignCenter: false,
        alignJustify: false
    }
};

//
// Convert aloha configuration to the new format
//
let alohaWarning = false;
const convertDeprecatedAlohaConfiguration = configuration => {
    if (
        !alohaWarning
    ) {
        //
        // TODO: Display url to migration info
        //
        logger.deprecate(`
            You are using a deprecated configuration format.
            The key "aloha" will be removed in future versions of Neos. Please have
            a look at -- to learn how to migrate.
        `);

        alohaWarning = true;
    }

    const check = key => format => Boolean(
        configuration[key] &&
        Object.keys(configuration[key])
            .map(k => configuration[key][k])
            .indexOf(format) !== -1
    );
    const checkFormat = check('format');
    const checkList = check('list');
    const checkAlignment = check('alignment');

    return {
        placeholder: configuration.placeholder || '',
        formats: {
            p: checkFormat('p'),
            h1: checkFormat('h1'),
            h2: checkFormat('h2'),
            h3: checkFormat('h3'),
            h4: checkFormat('h4'),
            h5: checkFormat('h5'),
            h6: checkFormat('h6'),
            pre: checkFormat('pre'),
            removeFormat: checkFormat('removeFormat'),
            bold: checkFormat('b') || checkFormat('strong'),
            italic: checkFormat('i') || checkFormat('em'),
            underline: checkFormat('u'),
            sub: checkFormat('sub'),
            sup: checkFormat('sup'),
            strikethrough: checkFormat('del'),
            ol: checkList('ol'),
            ul: checkList('ul'),
            alignLeft: checkAlignment('left'),
            alignRight: checkAlignment('right'),
            alignCenter: checkAlignment('center'),
            alignJustify: checkAlignment('justify')
        }
    };
};

//
// Expose a function, that discovers the inline editor configuration
// for a given node and property
//
export default (node, property) => {
    if (
        !node.nodeType ||
        !node.nodeType.properties ||
        !node.nodeType.properties[property] ||
        !node.nodeType.properties[property].ui
    ) {
        logger.warn(`
            Could not find inline editor configuration for "${property}" in
            "${node.contextPath}"
        `);

        return DEFAULT_CONFIGURATION;
    }

    const {ui} = node.nodeType.properties[property];
    const configuration = ui.aloha === undefined ?
        ui.inlineEditorOptions :
        convertDeprecatedAlohaConfiguration(ui.aloha);

    return merge(DEFAULT_CONFIGURATION, configuration);
};
