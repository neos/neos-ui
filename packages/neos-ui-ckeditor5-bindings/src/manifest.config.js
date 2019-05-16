import CkEditorConfigRegistry from './registry/CkEditorConfigRegistry';
import {$add, $get, $or} from 'plow-js';

import NeosPlaceholder from './plugins/neosPlaceholder';
import InlineMode from './plugins/inlineMode';
import Sub from './plugins/sub';
import Sup from './plugins/sup';
import LinkTargetBlank from './plugins/linkTargetBlank';
import LinkRelNofollow from './plugins/linkRelNofollow';
import LinkTitle from './plugins/linkTitle';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Link from '@ckeditor/ckeditor5-link/src/linkediting';
import List from '@ckeditor/ckeditor5-list/src/list';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import Table from '@ckeditor/ckeditor5-table/src/table';
import InsideTable from './plugins/insideTable';

const addPlugin = (Plugin, isEnabled) => (ckEditorConfiguration, options) => {
    // we duplicate editorOptions here so it would be possible to write smth like `$get('formatting.sup')`
    if (!isEnabled || isEnabled(options.editorOptions, options)) {
        ckEditorConfiguration.plugins = ckEditorConfiguration.plugins || [];
        return $add('plugins', Plugin, ckEditorConfiguration);
    }
    return ckEditorConfiguration;
};

// If the editable is a span or a heading, we automatically disable paragraphs and enable the soft break mode
// Also possible to force this behavior with `autoparagraph: false`
const disableParagraph = (editorOptions, {propertyDomNode}) =>
    $get('autoparagraph', editorOptions) === false ||
    propertyDomNode.tagName === 'SPAN' ||
    propertyDomNode.tagName === 'H1' ||
    propertyDomNode.tagName === 'H2' ||
    propertyDomNode.tagName === 'H3' ||
    propertyDomNode.tagName === 'H4' ||
    propertyDomNode.tagName === 'H5' ||
    propertyDomNode.tagName === 'H6';

//
// Create richtext editing toolbar registry
//
export default ckEditorRegistry => {
    const config = ckEditorRegistry.set('config', new CkEditorConfigRegistry(`
        Contains custom config for CkEditor

        In CKE all things are configured via a single configuration object: plugins, custom configs, etc (@see https://docs.ckeditor.com/ckeditor5/latest/builds/guides/integration/configuration.html)
        This registry allows to register a custom configuration processor that takes a configuration object, modifies it and returns a new one. Example:

        config.set('doSmthWithConfig', ckeConfig => {
            ckeConfig.mySetting = true;
            return ckeConfig;
        });

        The callback function gets passed TWO parameters; aside of the ckeConfig as first parameter, an object
        gets passed in as the second parameter with the following fields:

            - 'editorOptions': gets '[propertyName].ui.inline.editorOptions' from the NodeTypes.yaml
            - 'userPreferences': 'user.preferences' from redux store
            - 'globalRegistry': the global registry
            - 'propertyDomNode': the DOM node where the editor should be initialized.

        Thus, to e.g. only adjust the CKEditor config if a certain formatting option is enabled, you can do the following:

        config.set('doSmthWithConfig', (ckeConfig, {editorOptions}) => {
            if ($get(['formatting', 'myCustomField'], editorOptions)) {
                ckeConfig.mySetting = true;
            }
            return ckeConfig;
        });

        That is all you need to know about configuring CKE in Neos,
        refer to CKEditor 5 documentation for more details on what you can do with it: https://docs.ckeditor.com/ckeditor5/latest/index.html
    `));

    //
    // Base CKE configuration
    //
    config.set('baseConfiguration', (ckEditorConfiguration, {globalRegistry, editorOptions, userPreferences}) => {
        const i18nRegistry = globalRegistry.get('i18n');
        return Object.assign(ckEditorConfiguration, {
            language: String($get('interfaceLanguage', userPreferences)),
            neosPlaceholder: unescape(i18nRegistry.translate($get('placeholder', editorOptions) || ''))
        });
    });

    //
    // Add plugins
    //
    config.set('essentials', addPlugin(Essentials));
    config.set('paragraph', addPlugin(Paragraph));
    config.set('inlineMode', addPlugin(InlineMode, disableParagraph));
    config.set('neosPlaceholder', addPlugin(NeosPlaceholder));
    config.set('sub', addPlugin(Sub, $get('formatting.sub')));
    config.set('sup', addPlugin(Sup, $get('formatting.sup')));
    config.set('bold', addPlugin(Bold, $get('formatting.strong')));
    config.set('italic', addPlugin(Italic, $get('formatting.em')));
    config.set('underline', addPlugin(Underline, $get('formatting.underline')));
    config.set('strikethrough', addPlugin(Strikethrough, $get('formatting.strikethrough')));
    config.set('link', addPlugin(Link, $get('formatting.a')));
    config.set('linkTargetBlank', addPlugin(LinkTargetBlank, $get('formatting.a')));
    config.set('linkRelNofollow', addPlugin(LinkRelNofollow, $get('formatting.a')));
    config.set('linkTitle', addPlugin(LinkTitle, $get('formatting.a')));
    config.set('table', addPlugin(Table, i => $get('formatting.table', i)));
    config.set('insideTable', addPlugin(InsideTable, i => $get('formatting.table', i)));
    config.set('list', addPlugin(List, $or(
        $get('formatting.ul'),
        $get('formatting.ol')
    )));
    config.set('alignment', addPlugin(Alignment, $or(
        $get('formatting.left'),
        $get('formatting.center'),
        $get('formatting.right'),
        $get('formatting.justify')
    )));
    config.set('heading', addPlugin(Heading, $or(
        $get('formatting.h1'),
        $get('formatting.h2'),
        $get('formatting.h3'),
        $get('formatting.h4'),
        $get('formatting.h5'),
        $get('formatting.h6')
    )));

    //
    // @see https://docs.ckeditor.com/ckeditor5/latest/features/headings.html#configuring-heading-levels
    // The element names for the heading dropdown are coming from richtextToolbar registry
    //
    config.set('configureHeadings', config => Object.assign(config, {
        heading: {
            options: [
                {model: 'paragraph'},
                {model: 'heading1', view: 'h1'},
                {model: 'heading2', view: 'h2'},
                {model: 'heading3', view: 'h3'},
                {model: 'heading4', view: 'h4'},
                {model: 'heading5', view: 'h5'},
                {model: 'heading6', view: 'h6'},
                {model: 'pre', view: 'pre'}
            ]}
    }));

    return config;
};
