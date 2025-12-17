import {
    CkEditorConfigRegistry,
    CKEditorConfigurationProcessor,
    CKEditorConfigurationProcessorOptions
} from './registry/CkEditorConfigRegistry';
import {stripTags} from '@neos-project/utils-helpers';
import {translate} from '@neos-project/neos-ui-i18n';
import {SynchronousMetaRegistry} from '@neos-project/neos-ui-registry';

import {faTextWidth} from '@fortawesome/free-solid-svg-icons';
import {icon} from '@fortawesome/fontawesome-svg-core'

import {DisabledAutoparagraphMode} from './plugins/disabledAutoparagraphMode';
import {ItalicWithEm} from './plugins/italicWithEm';
import {ImageUploadAdapterPlugin} from './plugins/imageUpload';

import {Alignment} from '@ckeditor/ckeditor5-alignment';
import {Autoformat} from '@ckeditor/ckeditor5-autoformat';
import {BalloonToolbar} from '@ckeditor/ckeditor5-ui';
import {BlockQuote, BlockQuoteUI} from '@ckeditor/ckeditor5-block-quote';
import {Bold, Code, Underline, Superscript, Subscript, Italic, Strikethrough} from '@ckeditor/ckeditor5-basic-styles';
import {CodeBlock} from '@ckeditor/ckeditor5-code-block';
import {Essentials} from '@ckeditor/ckeditor5-essentials';
import {GeneralHtmlSupport} from '@ckeditor/ckeditor5-html-support';
import {Heading, HeadingButtonsUI} from '@ckeditor/ckeditor5-heading';
import {HorizontalLine} from '@ckeditor/ckeditor5-horizontal-line';
import {
    IconBulletedList,
    IconFontColor,
    IconParagraph,
    IconThreeVerticalDots
} from '@ckeditor/ckeditor5-icons';
import {Image, ImageUpload, ImageToolbar, ImageCaption, ImageTextAlternative} from '@ckeditor/ckeditor5-image';
import {Indent} from '@ckeditor/ckeditor5-indent';
import {List} from '@ckeditor/ckeditor5-list';
import {Paragraph, ParagraphButtonUI} from '@ckeditor/ckeditor5-paragraph';
import {RemoveFormat} from '@ckeditor/ckeditor5-remove-format';
import {Style} from '@ckeditor/ckeditor5-style';
import {Table, TableCaption, TableToolbar} from '@ckeditor/ckeditor5-table';
import {Undo} from '@ckeditor/ckeditor5-undo';
import {PluginConstructor} from '@ckeditor/ckeditor5-core';

const addPlugin = (Plugin: PluginConstructor, isEnabled?: (editorOptions: any) => boolean): CKEditorConfigurationProcessor => (ckEditorConfiguration, options) => {
    if (!isEnabled || isEnabled(options.editorOptions)) {
        return {
            ...ckEditorConfiguration,
            plugins: [
                ...(ckEditorConfiguration.plugins ?? []),
                Plugin
            ]
        };
    }
    return ckEditorConfiguration;
};

// If the editable is a span or a heading, we automatically disable paragraphs and enable the soft break mode
// Also possible to force this behavior with `autoparagraph: false`
const disableAutoparagraph = ({editorOptions, propertyDomNode}: CKEditorConfigurationProcessorOptions) =>
    editorOptions?.autoparagraph === false ||
    propertyDomNode.tagName === 'SPAN' ||
    propertyDomNode.tagName === 'H1' ||
    propertyDomNode.tagName === 'H2' ||
    propertyDomNode.tagName === 'H3' ||
    propertyDomNode.tagName === 'H4' ||
    propertyDomNode.tagName === 'H5' ||
    propertyDomNode.tagName === 'H6';

// Checks if the formatting options contains any block element
const hasBlockFormat = (editorOptions: any) => {
    if (!editorOptions?.formatting) {
        return false;
    }
    const {formatting} = editorOptions;
    return (
        formatting.h1
        || formatting.h2
        || formatting.h3
        || formatting.h4
        || formatting.h5
        || formatting.h6
        || formatting.p
        || formatting.pre
        || formatting.blockquote
    );
}

//
// Create richtext editing toolbar registry
//
export default (ckEditorRegistry: SynchronousMetaRegistry<unknown>) => {
    const config: CkEditorConfigRegistry = ckEditorRegistry.set('config', new CkEditorConfigRegistry(`
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
            if (editorOptions?.formatting.?myCustomField) {
                ckeConfig.mySetting = true;
            }
            return ckeConfig;
        });

        That is all you need to know about configuring CKE in Neos,
        refer to CKEditor 5 documentation for more details on what you can do with it: https://docs.ckeditor.com/ckeditor5/latest/index.html
    `));

    //
    // Base CKE configuration
    // - configuration of language
    // - and placeholder feature see https://ckeditor.com/docs/ckeditor5/16.0.0/api/module_core_editor_editorconfig-EditorConfig.html#member-placeholder
    //
    config.set('baseConfiguration', (ckEditorConfiguration, {editorOptions, userPreferences, globalRegistry}) => {
        const i18nRegistry = globalRegistry.get('i18n');
        const placeholder = editorOptions?.placeholder;

        return {
            ...ckEditorConfiguration,
            // stripTags, because we allow `<p>Edit text here</p>` as placeholder for legacy
            placeholder: placeholder ? stripTags(i18nRegistry.translate(placeholder) || '') : undefined,
            language: String(userPreferences?.interfaceLanguage),
            licenseKey: 'GPL',
            image: {
                upload: {
                    types: ['jpeg', 'png', 'gif', 'webp'],
                },
                toolbar: ['toggleImageCaption', 'imageTextAlternative'],
            }
        };
    });

    // General plugins
    config.set('autoformat', addPlugin(Autoformat));
    config.set('essentials', addPlugin(Essentials));
    config.set('removeFormat', addPlugin(RemoveFormat, editorOptions => editorOptions?.formatting?.removeFormat));
    config.set('disabledAutoparagraphMode', (ckEditorConfiguration, options) => ({
        ...ckEditorConfiguration,
        plugins: [
            ...(ckEditorConfiguration.plugins ?? []),
            ...(disableAutoparagraph(options) ? [DisabledAutoparagraphMode] : [])
        ]
    }));

    config.set('blockquote', addPlugin(BlockQuote, editorOptions => editorOptions?.formatting?.blockquote));
    config.set('blockquoteUi', addPlugin(BlockQuoteUI, editorOptions => editorOptions?.formatting?.blockquote));
    config.set('bold', addPlugin(Bold, editorOptions => editorOptions?.formatting?.strong));
    config.set('code', addPlugin(Code, editorOptions => editorOptions?.formatting?.code));
    config.set('codeBlock', addPlugin(CodeBlock, editorOptions => editorOptions?.formatting?.code));
    config.set('horizontalLine', addPlugin(HorizontalLine, editorOptions => editorOptions?.formatting?.horizontalLine));
    // Html support (https://ckeditor.com/docs/ckeditor5/latest/features/html/general-html-support.html)
    // is required for the custom styles selector (https://ckeditor.com/docs/ckeditor5/latest/features/style.html)
    // but could also allow additional features, see docs.
    config.set('htmlSupport', addPlugin(GeneralHtmlSupport));
    config.set('italic', addPlugin(Italic, editorOptions => editorOptions?.formatting?.em));
    config.set('paragraph', addPlugin(Paragraph));
    config.set('paragraphButtonUI', addPlugin(ParagraphButtonUI, hasBlockFormat));
    config.set('strikethrough', addPlugin(Strikethrough, editorOptions => editorOptions?.formatting?.strikethrough));
    config.set('style', addPlugin(Style, editorOptions => editorOptions?.formatting?.styleDefinitions));
    config.set('subscript', addPlugin(Subscript, editorOptions => editorOptions?.formatting?.sub));
    config.set('superscript', addPlugin(Superscript, editorOptions => editorOptions?.formatting?.sup));
    config.set('underline', addPlugin(Underline, editorOptions => editorOptions?.formatting?.underline));
    config.set('undo', addPlugin(Undo, editorOptions => editorOptions?.formatting?.undo));

    // Toolbar plugins
    config.set('balloonToolbar', addPlugin(BalloonToolbar));

    // Image plugins
    config.set('neosImageUpload', addPlugin(ImageUploadAdapterPlugin));
    config.set('image', addPlugin(Image));
    config.set('imageUpload', addPlugin(ImageUpload));
    config.set('imageToolbar', addPlugin(ImageToolbar));
    config.set('imageCaption', addPlugin(ImageCaption));
    config.set('imageTextAlternative', addPlugin(ImageTextAlternative));

    // Table related plugins
    config.set('table', addPlugin(Table, editorOptions => editorOptions?.formatting?.table));
    config.set('tableCaption', addPlugin(TableCaption, editorOptions => editorOptions?.formatting?.table));
    config.set('tableToolbar', addPlugin(TableToolbar, editorOptions => editorOptions?.formatting?.table));

    // List related plugins
    config.set('list', addPlugin(List, editorOptions => (
        editorOptions?.formatting?.ul
        || editorOptions?.formatting?.ol
    )));
    config.set('indent', addPlugin(Indent, editorOptions => editorOptions?.formatting?.indent));
    config.set('alignment', addPlugin(Alignment, editorOptions => (
        editorOptions?.formatting?.left
        || editorOptions?.formatting?.center
        || editorOptions?.formatting?.right
        || editorOptions?.formatting?.justify
    )));
    config.set('heading', addPlugin(Heading, hasBlockFormat));
    config.set('headingButtonsUI', addPlugin(HeadingButtonsUI, hasBlockFormat));

    // Custom Plugin that automatically converts <i> to <em> for italics
    // @fixes https://github.com/neos/neos-ui/issues/2906
    config.set('italicWithEm', addPlugin(ItalicWithEm, editorOptions => editorOptions?.formatting?.em));

    config.set('configureToolbar', (config, {editorOptions}) => {
        if (!editorOptions?.formatting) {
            return config;
        }
        const {formatting} = editorOptions;

        // Configure main toolbar
        const toolbarItems = [];
        if (formatting.undo) {
            toolbarItems.push('undo');
            toolbarItems.push('redo');
            toolbarItems.push('|');
        }
        if (hasBlockFormat(editorOptions)) {
            const blockFormatItems = [];
            if (formatting.p) {
                blockFormatItems.push('paragraph');
            }
            if (formatting.h1) {
                blockFormatItems.push('heading1');
            }
            if (formatting.h2) {
                blockFormatItems.push('heading2');
            }
            if (formatting.h3) {
                blockFormatItems.push('heading3');
            }
            if (formatting.h4) {
                blockFormatItems.push('heading4');
            }
            if (formatting.h5) {
                blockFormatItems.push('heading5');
            }
            if (formatting.h6) {
                blockFormatItems.push('heading6');
            }
            if (formatting.pre) {
                blockFormatItems.push('pre');
            }
            if (formatting.blockquote) {
                blockFormatItems.push('blockQuote');
            }
            if (formatting.code) {
                blockFormatItems.push('codeBlock');
            }
            toolbarItems.push({
                label: translate('Neos.Neos.Ui:Main:ckeditor__toolbar__blockformats', 'Block formats'),
                icon: IconParagraph,
                items: blockFormatItems
            });
        }
        if (formatting.left || formatting.center || formatting.right || formatting.justify) {
            toolbarItems.push('alignment');
        }
        if (hasBlockFormat(editorOptions) || formatting.left || formatting.center || formatting.right || formatting.justify) {
            toolbarItems.push('|');
        }
        if (formatting.ul || formatting.ol) {
            toolbarItems.push('|');
            toolbarItems.push({
                label: translate('Neos.Neos.Ui:Main:ckeditor__toolbar__lists', 'Lists'),
                icon: IconBulletedList,
                items: [
                    ...(formatting.ul ? ['bulletedList'] : []),
                    ...(formatting.ol ? ['numberedList'] : []),
                    ...(formatting.indent ? ['indent', 'outdent'] : [])
                ]
            });
        }

        // Items in the "Formatting options" dropdown of the main toolbar
        const blockFormattingToolbarItems = [];
        if (formatting.removeFormat) {
            blockFormattingToolbarItems.push('removeFormat');
        }
        if (formatting.styleDefinitions) {
            blockFormattingToolbarItems.push('style');
        }
        toolbarItems.push({
            label: translate('Neos.Neos.Ui:Main:ckeditor__toolbar__formatting', 'Formatting options'),
            tooltip: translate('Neos.Neos.Ui:Main:ckeditor__toolbar__formatting.tooltip', 'Additional formatting options'),
            icon: IconFontColor,
            items: blockFormattingToolbarItems
        })
        if (formatting.a) {
            toolbarItems.push('link');
        }

        // Items in the "More" dropdown of the main toolbar
        const moreToolbarItems = [];
        if (formatting.table) {
            moreToolbarItems.push('insertTable');
        }
        if (formatting.horizontalLine) {
            moreToolbarItems.push('horizontalLine');
        }
        toolbarItems.push({
            label: translate('Neos.Neos.Ui:Main:ckeditor__toolbar__more', 'More'),
            tooltip: translate('Neos.Neos.Ui:Main:ckeditor__toolbar__more.tooltip', 'Additional elements'),
            icon: IconThreeVerticalDots,
            items: moreToolbarItems
        });

        // Configure balloon toolbar
        const balloonToolbarItems = [];
        if (formatting.strong) {
            balloonToolbarItems.push('bold');
        }
        if (formatting.em) {
            balloonToolbarItems.push('italic');
        }
        if (formatting.sub) {
            balloonToolbarItems.push('subscript');
        }
        if (formatting.sup) {
            balloonToolbarItems.push('superscript');
        }
        if (formatting.underline) {
            balloonToolbarItems.push('underline');
        }
        if (formatting.strikethrough) {
            balloonToolbarItems.push('strikethrough');
        }
        if (formatting.code) {
            balloonToolbarItems.push('code');
        }
        const tableItems = formatting.table ? [
            'tableColumn',
            'tableRow',
            'mergeTableCells',
            'toggleTableCaption'
        ] : [];
        return Object.assign(config, {
            alignment: {
                options: [
                    ...(formatting.left ? ['left'] : []),
                    ...(formatting.center ? ['center'] : []),
                    ...(formatting.right ? ['right'] : []),
                    ...(formatting.justify ? ['justify'] : [])
                ]
            },
            heading: {
                options: [
                    {model: 'paragraph', title: 'Paragraph'},
                    {model: 'heading1', title: 'Heading 1', view: 'h1'},
                    {model: 'heading2', title: 'Heading 2', view: 'h2'},
                    {model: 'heading3', title: 'Heading 3', view: 'h3'},
                    {model: 'heading4', title: 'Heading 4', view: 'h4'},
                    {model: 'heading5', title: 'Heading 5', view: 'h5'},
                    {model: 'heading6', title: 'Heading 6', view: 'h6'},
                    {model: 'pre', title: 'Preformatted', view: 'pre', icon: icon(faTextWidth).html.join('')}
                ]
            },
            toolbar: {
                items: toolbarItems,
                shouldNotGroupWhenFull: false
            },
            balloonToolbar: {
                items: balloonToolbarItems,
                shouldNotGroupWhenFull: true
            },
            table: {
                contentToolbar: tableItems
            },
            codeBlock: {
                languages: [
                    {language: 'css', label: 'CSS'},
                    {language: 'html', label: 'HTML'}
                ]
            },
            style: {
                definitions: formatting.styleDefinitions || []
            }
        })
    });

    return config;
};
