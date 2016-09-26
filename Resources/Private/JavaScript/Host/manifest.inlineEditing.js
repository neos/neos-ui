import IconButton from '@neos-project/react-ui-components/lib/IconButton/';
import StyleSelect from 'Host/Containers/SecondaryToolbar/EditorToolbar/StyleSelect';

export const configureInlineEditing = registry => {
    /**
     * Basic Inline Styles (Bold, Italic, ...)
     */

    // Bold
    registry.ckEditor.formattingRules.add('strong', {
        command: 'bold',
        config: registry.ckEditor.formattingRules.config.add('Bold')
    });
    registry.ckEditor.toolbar.add('strong', {
        formattingRule: 'strong',
        component: IconButton,
        callbackPropName: 'onClick',

        icon: 'bold',
        hoverStyle: 'brand'
    });

    // Italic
    registry.ckEditor.formattingRules.add('em', {
        command: 'italic',
        config: registry.ckEditor.formattingRules.config.add('Italic')
    });
    registry.ckEditor.toolbar.add('italic', {
        formattingRule: 'em',
        component: IconButton,
        callbackPropName: 'onClick',

        icon: 'italic',
        hoverStyle: 'brand'
    });

    // Underline
    registry.ckEditor.formattingRules.add('u', {
        command: 'underline',
        config: registry.ckEditor.formattingRules.config.add('Underline')
    });
    registry.ckEditor.toolbar.add('underline', {
        formattingRule: 'u',
        component: IconButton,
        callbackPropName: 'onClick',

        icon: 'underline',
        hoverStyle: 'brand'
    });

    // Subscript
    registry.ckEditor.formattingRules.add('sub', {
        command: 'subscript',
        config: registry.ckEditor.formattingRules.config.add('Subscript')
    });
    registry.ckEditor.toolbar.add('subscript', {
        formattingRule: 'sub',
        component: IconButton,
        callbackPropName: 'onClick',

        icon: 'subscript',
        hoverStyle: 'brand'
    });

    // Superscript
    registry.ckEditor.formattingRules.add('sup', {
        command: 'superscript',
        config: registry.ckEditor.formattingRules.config.add('Superscript')
    });
    registry.ckEditor.toolbar.add('superscript', {
        formattingRule: 'sup',
        component: IconButton,
        callbackPropName: 'onClick',

        icon: 'superscript',
        hoverStyle: 'brand'
    });

    // Strike-Through
    registry.ckEditor.formattingRules.add('del', {
        command: 'strike',
        config: registry.ckEditor.formattingRules.config.add('Strike')
    });
    registry.ckEditor.toolbar.add('strikethrough', {
        formattingRule: 'del',
        component: IconButton,
        callbackPropName: 'onClick',

        icon: 'strikethrough',
        hoverStyle: 'brand'
    });

    /**
     * Basic Paragraph Styles (p, h1, h2, pre, ...)
     */
    registry.ckEditor.toolbar.add('style', {
        component: StyleSelect,
        callbackPropName: 'onSelect',
        isVisibleWhen: () => true
    });

    // p tag
    registry.ckEditor.formattingRules.add('p', {
        style: {element: 'p'},
        config: registry.ckEditor.formattingRules.config.addToFormatTags('p')
    });
    registry.ckEditor.toolbar.add('style/p', {
        formattingRule: 'p',
        label: 'Paragraph'
    });

    // h1
    registry.ckEditor.formattingRules.add('h1', {
        style: {element: 'h1'},
        config: registry.ckEditor.formattingRules.config.addToFormatTags('h1')
    });
    registry.ckEditor.toolbar.add('style/h1', {
        formattingRule: 'h1',
        label: 'Headline 1'
    });

    // h2
    registry.ckEditor.formattingRules.add('h2', {
        style: {element: 'h2'},
        config: registry.ckEditor.formattingRules.config.addToFormatTags('h2')
    });
    registry.ckEditor.toolbar.add('style/h2', {
        formattingRule: 'h2',
        label: 'Headline 2'
    });

    // h3
    registry.ckEditor.formattingRules.add('h3', {
        style: {element: 'h3'},
        config: registry.ckEditor.formattingRules.config.addToFormatTags('h3')
    });
    registry.ckEditor.toolbar.add('style/h3', {
        formattingRule: 'h3',
        label: 'Headline 3'
    });

    // h4
    registry.ckEditor.formattingRules.add('h4', {
        style: {element: 'h4'},
        config: registry.ckEditor.formattingRules.config.addToFormatTags('h4')
    });
    registry.ckEditor.toolbar.add('style/h4', {
        formattingRule: 'h4',
        label: 'Headline 4'
    });

    // h5
    registry.ckEditor.formattingRules.add('h5', {
        style: {element: 'h5'},
        config: registry.ckEditor.formattingRules.config.addToFormatTags('h5')
    });
    registry.ckEditor.toolbar.add('style/h5', {
        formattingRule: 'h5',
        label: 'Headline 5'
    });

    // h6
    registry.ckEditor.formattingRules.add('h6', {
        style: {element: 'h6'},
        config: registry.ckEditor.formattingRules.config.addToFormatTags('h6')
    });
    registry.ckEditor.toolbar.add('style/h6', {
        formattingRule: 'h6',
        label: 'Headline 6'
    });

    // pre
    registry.ckEditor.formattingRules.add('pre', {
        style: {element: 'pre'},
        config: registry.ckEditor.formattingRules.config.addToFormatTags('pre')
    });
    registry.ckEditor.toolbar.add('style/pre', {
        formattingRule: 'pre',
        label: 'Preformatted'
    });

    /**
     * Sorted and Unsorted Lists
     */

    // ordered list
    registry.ckEditor.formattingRules.add('ol', {
        command: 'numberedlist',
        config: registry.ckEditor.formattingRules.config.add('NumberedList')
    });
    registry.ckEditor.toolbar.add('orderedList', {
        formattingRule: 'ol',
        component: IconButton,
        callbackPropName: 'onClick',

        icon: 'list-ol',
        hoverStyle: 'brand'
    });

    // unordered list
    registry.ckEditor.formattingRules.add('ul', {
        command: 'bulletedlist',
        config: registry.ckEditor.formattingRules.config.add('BulletedList')
    });
    registry.ckEditor.toolbar.add('unorderedList', {
        formattingRule: 'ul',
        component: IconButton,
        callbackPropName: 'onClick',

        icon: 'list-ul',
        hoverStyle: 'brand'
    });

    // Indent
    registry.ckEditor.formattingRules.add('indent', {
        command: 'indent'
    });
    registry.ckEditor.toolbar.add('indent', {
        formattingRule: 'indent',
        component: IconButton,
        callbackPropName: 'onClick',

        icon: 'indent',
        hoverStyle: 'brand',
        isVisibleWhen: (enabledFormattingRuleIds, formattingUnderCursor) => {
            return (enabledFormattingRuleIds.indexOf('ul') !== -1 || enabledFormattingRuleIds.indexOf('ol') !== -1) &&
                formattingUnderCursor.indent !== registry.ckEditor.toolbar.TRISTATE_DISABLED;
        }
    });

    // Outdent
    registry.ckEditor.formattingRules.add('outdent', {
        command: 'outdent'
    });
    registry.ckEditor.toolbar.add('outdent', {
        formattingRule: 'outdent',
        component: IconButton,
        callbackPropName: 'onClick',

        icon: 'outdent',
        hoverStyle: 'brand',
        isVisibleWhen: (enabledFormattingRuleIds, formattingUnderCursor) => {
            return (enabledFormattingRuleIds.indexOf('ul') !== -1 || enabledFormattingRuleIds.indexOf('ol') !== -1) &&
                formattingUnderCursor.outdent !== registry.ckEditor.toolbar.TRISTATE_DISABLED;
        }
    });

    /**
     * Tables
     */
    registry.ckEditor.formattingRules.add('table', {
        command: 'table',
        config: registry.ckEditor.formattingRules.config.add('Table')
    });
    registry.ckEditor.toolbar.add('table', {
        formattingRule: 'table',
        component: IconButton,
        callbackPropName: 'onClick',

        icon: 'table',
        hoverStyle: 'brand'
    });

    /**
     * Remove formatting
     */
    registry.ckEditor.formattingRules.add('removeFormat', {
        command: 'removeFormat'
    });
    registry.ckEditor.toolbar.add('removeFormat', {
        formattingRule: 'removeFormat',
        component: IconButton,
        callbackPropName: 'onClick',

        icon: 'table',
        hoverStyle: 'brand'
    });
};
