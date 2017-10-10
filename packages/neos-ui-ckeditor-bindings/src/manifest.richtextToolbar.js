import React from 'react';
import omit from 'lodash.omit';
import IconButton from '@neos-project/react-ui-components/src/IconButton/';

import LinkIconButton from './EditorToolbar/LinkIconButton';
import StyleSelect from './EditorToolbar/StyleSelect';
import RichTextToolbarRegistry from './registry/RichTextToolbarRegistry';

const IconButtonComponent = props => {
    const finalProps = omit(props, ['formattingRule']);
    return (<IconButton {...finalProps}/>);
};

//
// Create richtext editing toolbar registry
//
export default (ckEditorRegistry, nodeTypesRegistry) => {
    const richtextToolbar = ckEditorRegistry.set('richtextToolbar', new RichTextToolbarRegistry(`
        Contains the Rich Text Editing Toolbar components.

        The values are objects of the following form:

            {
                formatting: 'h1' // References a key inside "formattingRules"
                component: Button // the React component being used for rendering
                callbackPropName: 'onClick' // Name of the callback prop of the Component which is
                                            fired when the component's value changes.

                // all other properties are directly passed on to the component.
            }

        ## Component wiring

        - Each toolbar component receives all properties except "formatting" and "component" directly as props.
        - Furthermore, the "isActive" property is bound, which is a boolean flag defining whether the text style
            referenced by "formatting" is currently active or not.
        - Furthermore, the callback specified in "callbackPropName" is wired, which toggles the value.

        For advanced use-cases; also the "formattingRule" is bound to the component; containing a formatting-rule identifier (string).
        If you need this, you'll most likely need to listen to selectors.UI.ContentCanvas.formattingUnderCursor and extract
        your relevant information manually.
    `));

    richtextToolbar.setNodeTypesRegistry(nodeTypesRegistry);

    //
    // Configure richtext editing toolbar
    //

    /**
     * Basic Inline Styles (Bold, Italic, ...)
     */

    // Bold
    richtextToolbar.set('strong', {
        formattingRule: 'strong',
        component: IconButtonComponent,
        callbackPropName: 'onClick',

        icon: 'bold',
        hoverStyle: 'brand'
    });

    // Italic
    richtextToolbar.set('italic', {
        formattingRule: 'em',
        component: IconButtonComponent,
        callbackPropName: 'onClick',

        icon: 'italic',
        hoverStyle: 'brand'
    });

    // Underline
    richtextToolbar.set('underline', {
        formattingRule: 'u',
        component: IconButtonComponent,
        callbackPropName: 'onClick',

        icon: 'underline',
        hoverStyle: 'brand'
    });

    // Subscript
    richtextToolbar.set('subscript', {
        formattingRule: 'sub',
        component: IconButtonComponent,
        callbackPropName: 'onClick',

        icon: 'subscript',
        hoverStyle: 'brand'
    });

    // Superscript
    richtextToolbar.set('superscript', {
        formattingRule: 'sup',
        component: IconButtonComponent,
        callbackPropName: 'onClick',

        icon: 'superscript',
        hoverStyle: 'brand'
    });

    // Strike-Through
    richtextToolbar.set('strikethrough', {
        formattingRule: 'del',
        component: IconButtonComponent,
        callbackPropName: 'onClick',

        icon: 'strikethrough',
        hoverStyle: 'brand'
    });

    // Strike-Through
    richtextToolbar.set('link', {
        formattingRule: 'a',
        component: LinkIconButton,
        callbackPropName: 'onClick',

        icon: 'link',
        hoverStyle: 'brand'
    });

    /**
     * Basic Paragraph Styles (p, h1, h2, pre, ...)
     */
    richtextToolbar.set('style', {
        component: StyleSelect,
        callbackPropName: 'onSelect',
        isVisibleWhen: () => true
    });

    // p tag
    richtextToolbar.set('style/p', {
        formattingRule: 'p',
        label: 'Paragraph'
    });

    // h1
    richtextToolbar.set('style/h1', {
        formattingRule: 'h1',
        label: 'Headline 1'
    });

    // h2
    richtextToolbar.set('style/h2', {
        formattingRule: 'h2',
        label: 'Headline 2'
    });

    // h3
    richtextToolbar.set('style/h3', {
        formattingRule: 'h3',
        label: 'Headline 3'
    });

    // h4
    richtextToolbar.set('style/h4', {
        formattingRule: 'h4',
        label: 'Headline 4'
    });

    // h5
    richtextToolbar.set('style/h5', {
        formattingRule: 'h5',
        label: 'Headline 5'
    });

    // h6
    richtextToolbar.set('style/h6', {
        formattingRule: 'h6',
        label: 'Headline 6'
    });

    // pre
    richtextToolbar.set('style/pre', {
        formattingRule: 'pre',
        label: 'Preformatted'
    });

    /**
     * Sorted and Unsorted Lists
     */

    // ordered list
    richtextToolbar.set('orderedList', {
        formattingRule: 'ol',
        component: IconButtonComponent,
        callbackPropName: 'onClick',

        icon: 'list-ol',
        hoverStyle: 'brand'
    });

    // unordered list
    richtextToolbar.set('unorderedList', {
        formattingRule: 'ul',
        component: IconButtonComponent,
        callbackPropName: 'onClick',

        icon: 'list-ul',
        hoverStyle: 'brand'
    });

    // Indent
    richtextToolbar.set('indent', {
        formattingRule: 'indent',
        component: IconButtonComponent,
        callbackPropName: 'onClick',

        icon: 'indent',
        hoverStyle: 'brand',
        isVisibleWhen: (enabledFormattingRuleIds, formattingUnderCursor) => {
            return (enabledFormattingRuleIds.indexOf('ul') !== -1 || enabledFormattingRuleIds.indexOf('ol') !== -1) &&
                formattingUnderCursor.indent !== richtextToolbar.TRISTATE_DISABLED;
        }
    });

    // Outdent
    richtextToolbar.set('outdent', {
        formattingRule: 'outdent',
        component: IconButtonComponent,
        callbackPropName: 'onClick',

        icon: 'outdent',
        hoverStyle: 'brand',
        isVisibleWhen: (enabledFormattingRuleIds, formattingUnderCursor) => {
            return (enabledFormattingRuleIds.indexOf('ul') !== -1 || enabledFormattingRuleIds.indexOf('ol') !== -1) &&
                formattingUnderCursor.outdent !== richtextToolbar.TRISTATE_DISABLED;
        }
    });

    /**
     * Alignment
     */
    richtextToolbar.set('alignleft', {
        formattingRule: 'left',
        component: IconButtonComponent,
        callbackPropName: 'onClick',

        icon: 'align-left',
        hoverStyle: 'brand'
    });

    richtextToolbar.set('aligncenter', {
        formattingRule: 'center',
        component: IconButtonComponent,
        callbackPropName: 'onClick',

        icon: 'align-center',
        hoverStyle: 'brand'
    });

    richtextToolbar.set('alignright', {
        formattingRule: 'right',
        component: IconButtonComponent,
        callbackPropName: 'onClick',

        icon: 'align-right',
        hoverStyle: 'brand'
    });

    richtextToolbar.set('alignjustify', {
        formattingRule: 'justify',
        component: IconButtonComponent,
        callbackPropName: 'onClick',

        icon: 'align-justify',
        hoverStyle: 'brand'
    });

    /**
     * Tables
     */
    richtextToolbar.set('table', {
        formattingRule: 'table',
        component: IconButtonComponent,
        callbackPropName: 'onClick',

        icon: 'table',
        hoverStyle: 'brand'
    });

    /**
     * Remove formatting
     */
    richtextToolbar.set('removeFormat', {
        formattingRule: 'removeFormat',
        component: IconButtonComponent,
        callbackPropName: 'onClick',

        icon: 'table',
        hoverStyle: 'brand'
    });

    return richtextToolbar;
};
