import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash.omit';

import IconButton from '@neos-project/react-ui-components/src/IconButton/';
import LinkButton from './EditorToolbar/LinkButton';
import TableButton from './EditorToolbar/TableButton';
import TableDropDown from './EditorToolbar/TableDropDown';
import {neos} from '@neos-project/neos-ui-decorators';
import StyleSelect from './EditorToolbar/StyleSelect';
import RichTextToolbarRegistry from './registry/RichTextToolbarRegistry';

@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))
class IconButtonComponent extends PureComponent {
    static propTypes = {
        i18nRegistry: PropTypes.object,
        tooltip: PropTypes.string
    };

    render() {
        const finalProps = omit(this.props, ['executeCommand', 'formattingRule', 'formattingUnderCursor', 'inlineEditorOptions', 'i18nRegistry', 'tooltip', 'isActive']);
        return (<IconButton {...finalProps} isActive={Boolean(this.props.isActive)} title={this.props.i18nRegistry.translate(this.props.tooltip)} />);
    }
}

//
// Create richtext editing toolbar registry
//
export default ckEditorRegistry => {
    const richtextToolbar = ckEditorRegistry.set('richtextToolbar', new RichTextToolbarRegistry(`
        Contains the Rich Text Editing Toolbar components.

        Buttons in the Rich Text Editing Toolbar are just plain React components.
        The only way for these components to communicate with CKE is via its commands mechanism
        (@see https://docs.ckeditor.com/ckeditor5/latest/framework/guides/architecture/core-editor-architecture.html#commands)
        Some commands may take arguments.
        Commands are provided and handled by CKE plugins. Refer to manifest.config.js to see how to configure custom plugins.

        The values are objects of the following form:

            {
                commandName: 'bold' // A CKE command that gets dispatched
                commandArgs: [arg1, arg2] // Additional arguments passed together with a command
                component: Button // the React component being used for rendering
                isVisible: (editorOptions, formattingUnderCursor) => true // A function that decides is the button should be visible or not
                isActive: (formattingUnderCursor, editorOptions) => true // A function that decides is the button should be active or not
                callbackPropName: 'onClick' // Name of the callback prop of the Component which is fired when the component's value changes
                executeCommand: (command, argument, reFocusEditor = true) => void // An "executeCommand" from the current CKE5 instance
                formattingUnderCursor: {formattingRule: value} // Formatting state under the cursor

                // all other properties are directly passed on to the component.
            }
    `));

    //
    // Configure richtext editing toolbar
    //

    /**
     * Basic Inline Styles (Bold, Italic, ...)
     */

    // Bold
    richtextToolbar.set('strong', {
        commandName: 'bold',
        component: IconButtonComponent,
        callbackPropName: 'onClick',
        icon: 'bold',
        hoverStyle: 'brand',
        tooltip: 'Neos.Neos.Ui:Main:ckeditor__toolbar__bold',
        isVisible: editorOptions => editorOptions?.formatting?.strong,
        isActive: formattingUnderCursor => formattingUnderCursor?.bold
    });

    // Italic
    richtextToolbar.set('italic', {
        commandName: 'italic',
        component: IconButtonComponent,
        callbackPropName: 'onClick',
        icon: 'italic',
        hoverStyle: 'brand',
        tooltip: 'Neos.Neos.Ui:Main:ckeditor__toolbar__italic',
        isVisible: editorOptions => editorOptions?.formatting?.em,
        isActive: formattingUnderCursor => formattingUnderCursor?.italic
    });

    // Underline
    richtextToolbar.set('underline', {
        commandName: 'underline',
        component: IconButtonComponent,
        callbackPropName: 'onClick',
        icon: 'underline',
        hoverStyle: 'brand',
        tooltip: 'Neos.Neos.Ui:Main:ckeditor__toolbar__underline',
        isVisible: editorOptions => editorOptions?.formatting?.underline,
        isActive: formattingUnderCursor => formattingUnderCursor?.underline
    });

    // Subscript
    richtextToolbar.set('subscript', {
        commandName: 'sub',
        component: IconButtonComponent,
        callbackPropName: 'onClick',
        icon: 'subscript',
        hoverStyle: 'brand',
        tooltip: 'Neos.Neos.Ui:Main:ckeditor__toolbar__subscript',
        isVisible: editorOptions => editorOptions?.formatting?.sub,
        isActive: formattingUnderCursor => formattingUnderCursor?.sub
    });

    // Superscript
    richtextToolbar.set('superscript', {
        commandName: 'sup',
        component: IconButtonComponent,
        callbackPropName: 'onClick',
        icon: 'superscript',
        hoverStyle: 'brand',
        tooltip: 'Neos.Neos.Ui:Main:ckeditor__toolbar__superscript',
        isVisible: editorOptions => editorOptions?.formatting?.sup,
        isActive: formattingUnderCursor => formattingUnderCursor?.sup
    });

    // Strike-Through
    richtextToolbar.set('strikethrough', {
        commandName: 'strikethrough',
        component: IconButtonComponent,
        callbackPropName: 'onClick',
        icon: 'strikethrough',
        hoverStyle: 'brand',
        tooltip: 'Neos.Neos.Ui:Main:ckeditor__toolbar__strikethrough',
        isVisible: editorOptions => editorOptions?.formatting?.strikethrough,
        isActive: formattingUnderCursor => formattingUnderCursor?.strikethrough
    });

    // Strike-Through
    richtextToolbar.set('link', {
        commandName: 'link',
        component: LinkButton,
        isVisible: formattingUnderCursor => formattingUnderCursor?.formatting?.a
    });

    /**
     * Basic Paragraph Styles (p, h1, h2, pre, ...)
     */
    richtextToolbar.set('style', {
        component: StyleSelect,
        callbackPropName: 'onSelect',
        isVisible: () => true,
        isActive: formattingUnderCursor => formattingUnderCursor?.heading
    });

    // P tag
    richtextToolbar.set('style/p', {
        commandName: 'heading',
        commandArgs: [{
            value: 'paragraph'
        }],
        label: 'Neos.Neos.Ui:Main:ckeditor__toolbar__style__p',
        isVisible: editorOptions => editorOptions?.formatting?.p,
        isActive: formattingUnderCursor => !formattingUnderCursor?.heading
    });

    // H1
    richtextToolbar.set('style/h1', {
        commandName: 'heading',
        commandArgs: [{
            value: 'heading1'
        }],
        label: 'Neos.Neos.Ui:Main:ckeditor__toolbar__style__h1',
        isVisible: editorOptions => editorOptions?.formatting?.h1,
        isActive: formattingUnderCursor => formattingUnderCursor?.heading === 'heading1'
    });

    // H2
    richtextToolbar.set('style/h2', {
        commandName: 'heading',
        commandArgs: [{
            value: 'heading2'
        }],
        label: 'Neos.Neos.Ui:Main:ckeditor__toolbar__style__h2',
        isVisible: editorOptions => editorOptions?.formatting?.h2,
        isActive: formattingUnderCursor => formattingUnderCursor?.heading === 'heading2'
    });

    // H3
    richtextToolbar.set('style/h3', {
        commandName: 'heading',
        commandArgs: [{
            value: 'heading3'
        }],
        label: 'Neos.Neos.Ui:Main:ckeditor__toolbar__style__h3',
        isVisible: editorOptions => editorOptions?.formatting?.h3,
        isActive: formattingUnderCursor => formattingUnderCursor?.heading === 'heading3'
    });

    // H4
    richtextToolbar.set('style/h4', {
        commandName: 'heading',
        commandArgs: [{
            value: 'heading4'
        }],
        label: 'Neos.Neos.Ui:Main:ckeditor__toolbar__style__h4',
        isVisible: editorOptions => editorOptions?.formatting?.h4,
        isActive: formattingUnderCursor => formattingUnderCursor?.heading === 'heading4'
    });

    // H5
    richtextToolbar.set('style/h5', {
        commandName: 'heading',
        commandArgs: [{
            value: 'heading5'
        }],
        label: 'Neos.Neos.Ui:Main:ckeditor__toolbar__style__h5',
        isVisible: editorOptions => editorOptions?.formatting?.h5,
        isActive: formattingUnderCursor => formattingUnderCursor?.heading === 'heading5'
    });

    // H6
    richtextToolbar.set('style/h6', {
        commandName: 'heading',
        commandArgs: [{
            value: 'heading6'
        }],
        label: 'Neos.Neos.Ui:Main:ckeditor__toolbar__style__h6',
        isVisible: editorOptions => editorOptions?.formatting?.h6,
        isActive: formattingUnderCursor => formattingUnderCursor?.heading === 'heading6'
    });

    // Pre
    richtextToolbar.set('style/pre', {
        commandName: 'heading',
        commandArgs: [{
            value: 'pre'
        }],
        label: 'Neos.Neos.Ui:Main:ckeditor__toolbar__style__pre',
        isVisible: editorOptions => editorOptions?.formatting?.pre,
        isActive: formattingUnderCursor => formattingUnderCursor?.heading === 'pre'
    });

    // Blockquote
    richtextToolbar.set('style/blockquote', {
        commandName: 'heading',
        commandArgs: [{
            value: 'blockquote'
        }],
        label: 'Neos.Neos.Ui:Main:ckeditor__toolbar__style__blockquote',
        isVisible: editorOptions => editorOptions?.formatting?.blockquote,
        isActive: formattingUnderCursor => formattingUnderCursor?.heading === 'blockquote'
    });

    // // Example of custom headline
    // // Don't forget about updating the config registry with relevant config
    // // @see https://docs.ckeditor.com/ckeditor5/latest/features/headings.html
    //
    // richtextToolbar.set('style/fancy', {
    //     commandName: 'heading',
    //     commandArgs: [{
    //         value: 'headingFancy'
    //     }],
    //     label: 'Fancy',
    //     isVisible: editorOptions => editorOptions?.formatting?.h1,
    //     isActive: formattingUnderCursor => formattingUnderCursor?.heading === 'headingFancy'
    // });

    // /**
    //  * Sorted and Unsorted Lists
    //  */

    // ordered list
    richtextToolbar.set('orderedList', {
        commandName: 'numberedList',
        component: IconButtonComponent,
        callbackPropName: 'onClick',
        icon: 'list-ol',
        hoverStyle: 'brand',
        tooltip: 'Neos.Neos.Ui:Main:ckeditor__toolbar__ordered-list',
        isVisible: editorOptions => editorOptions?.formatting?.ol,
        isActive: formattingUnderCursor => formattingUnderCursor?.numberedList
    });

    // Unordered list
    richtextToolbar.set('unorderedList', {
        commandName: 'bulletedList',
        component: IconButtonComponent,
        callbackPropName: 'onClick',
        icon: 'list-ul',
        hoverStyle: 'brand',
        tooltip: 'Neos.Neos.Ui:Main:ckeditor__toolbar__unordered-list',
        isVisible: editorOptions => editorOptions?.formatting?.ul,
        isActive: formattingUnderCursor => formattingUnderCursor?.bulletedList
    });

    // Indent
    richtextToolbar.set('indent', {
        commandName: 'indentList',
        component: IconButtonComponent,
        callbackPropName: 'onClick',
        icon: 'indent',
        hoverStyle: 'brand',
        tooltip: 'Neos.Neos.Ui:Main:ckeditor__toolbar__indent',
        isVisible: (editorOptions, formattingUnderCursor) => (
            // Cursor in ul
            formattingUnderCursor?.bulletedList ||
            // Cursor in ol
            formattingUnderCursor?.numberedList ||
            // Indent generally enabled
            editorOptions?.formatting?.indent
        )
    });

    // Outdent
    richtextToolbar.set('outdent', {
        commandName: 'outdentList',
        component: IconButtonComponent,
        callbackPropName: 'onClick',

        icon: 'outdent',
        hoverStyle: 'brand',
        tooltip: 'Neos.Neos.Ui:Main:ckeditor__toolbar__outdent',
        isVisible: (editorOptions, formattingUnderCursor) => (
            // Cursor in ul
            formattingUnderCursor?.bulletedList ||
            // Cursor in ol
            formattingUnderCursor?.numberedList ||
            // Outdent generally enabled
            editorOptions?.formatting?.outdent
        )
    });

    /**
     * Alignment
     */
    richtextToolbar.set('alignleft', {
        commandName: 'alignment',
        commandArgs: [{value: 'left'}],
        component: IconButtonComponent,
        callbackPropName: 'onClick',
        icon: 'align-left',
        hoverStyle: 'brand',
        tooltip: 'Neos.Neos.Ui:Main:ckeditor__toolbar__align-left',
        isVisible: editorOptions => editorOptions?.formatting?.left,
        isActive: formattingUnderCursor => formattingUnderCursor?.alignment === 'left'
    });

    richtextToolbar.set('aligncenter', {
        commandName: 'alignment',
        commandArgs: [{value: 'center'}],
        component: IconButtonComponent,
        callbackPropName: 'onClick',
        icon: 'align-center',
        hoverStyle: 'brand',
        tooltip: 'Neos.Neos.Ui:Main:ckeditor__toolbar__align-center',
        isVisible: editorOptions => editorOptions?.formatting?.center,
        isActive: formattingUnderCursor => formattingUnderCursor?.alignment === 'center'
    });

    richtextToolbar.set('alignright', {
        commandName: 'alignment',
        commandArgs: [{value: 'right'}],
        component: IconButtonComponent,
        callbackPropName: 'onClick',
        icon: 'align-right',
        hoverStyle: 'brand',
        tooltip: 'Neos.Neos.Ui:Main:ckeditor__toolbar__align-right',
        isVisible: editorOptions => editorOptions?.formatting?.right,
        isActive: formattingUnderCursor => formattingUnderCursor?.alignment === 'right'
    });

    richtextToolbar.set('alignjustify', {
        commandName: 'alignment',
        commandArgs: [{value: 'justify'}],
        component: IconButtonComponent,
        callbackPropName: 'onClick',
        icon: 'align-justify',
        hoverStyle: 'brand',
        tooltip: 'Neos.Neos.Ui:Main:ckeditor__toolbar__align-justify',
        isVisible: editorOptions => editorOptions?.formatting?.justify,
        isActive: formattingUnderCursor => formattingUnderCursor?.alignment === 'justify'
    });

    /**
     * Tables
     */
    richtextToolbar.set('table', {
        component: TableButton,
        icon: 'table',
        tooltip: 'Neos.Neos.Ui:Main:ckeditor__toolbar__table',
        isVisible: (editorOptions, formattingUnderCursor) => !formattingUnderCursor?.insideTable && editorOptions?.formatting?.table
    });
    richtextToolbar.set('tableColumn', {
        component: TableDropDown,
        icon: 'tableColumn',
        tooltip: 'Neos.Neos.Ui:Main:ckeditor__toolbar__tableColumn',
        isVisible: (editorOptions, formattingUnderCursor) => formattingUnderCursor?.insideTable,
        options: [
            {
                commandName: 'setTableColumnHeader',
                label: 'Neos.Neos.Ui:Main:ckeditor__toolbar__setTableColumnHeader',
                type: 'checkBox'
            },
            {
                commandName: 'insertTableColumnLeft',
                label: 'Neos.Neos.Ui:Main:ckeditor__toolbar__insertTableColumnLeft'
            },
            {
                commandName: 'insertTableColumnRight',
                label: 'Neos.Neos.Ui:Main:ckeditor__toolbar__insertTableColumnRight'
            },
            {
                commandName: 'removeTableColumn',
                label: 'Neos.Neos.Ui:Main:ckeditor__toolbar__removeTableColumn'
            }
        ]
    });
    richtextToolbar.set('tableRow', {
        component: TableDropDown,
        icon: 'tableRow',
        tooltip: 'Neos.Neos.Ui:Main:ckeditor__toolbar__tableRow',
        isVisible: (editorOptions, formattingUnderCursor) => formattingUnderCursor?.insideTable,
        options: [
            {
                commandName: 'setTableRowHeader',
                label: 'Neos.Neos.Ui:Main:ckeditor__toolbar__setTableRowHeader',
                type: 'checkBox'
            },
            {
                commandName: 'insertTableRowAbove',
                label: 'Neos.Neos.Ui:Main:ckeditor__toolbar__insertTableRowAbove'
            },
            {
                commandName: 'insertTableRowBelow',
                label: 'Neos.Neos.Ui:Main:ckeditor__toolbar__insertTableRowBelow'
            },
            {
                commandName: 'removeTableRow',
                label: 'Neos.Neos.Ui:Main:ckeditor__toolbar__removeTableRow'
            }
        ]
    });
    richtextToolbar.set('mergeTableCells', {
        component: TableDropDown,
        icon: 'tableMergeCells',
        isVisible: (editorOptions, formattingUnderCursor) => formattingUnderCursor?.insideTable,
        tooltip: 'Neos.Neos.Ui:Main:ckeditor__toolbar__tableMergeCells',
        options: [
            {
                commandName: 'mergeTableCellUp',
                label: 'Neos.Neos.Ui:Main:ckeditor__toolbar__mergeTableCellUp'
            },
            {
                commandName: 'mergeTableCellRight',
                label: 'Neos.Neos.Ui:Main:ckeditor__toolbar__mergeTableCellRight'
            },
            {
                commandName: 'mergeTableCellDown',
                label: 'Neos.Neos.Ui:Main:ckeditor__toolbar__mergeTableCellDown'
            },
            {
                commandName: 'mergeTableCellLeft',
                label: 'Neos.Neos.Ui:Main:ckeditor__toolbar__mergeTableCellLeft'
            },
            {
                commandName: 'splitTableCellVertically',
                label: 'Neos.Neos.Ui:Main:ckeditor__toolbar__splitTableCellVertically'
            },
            {
                commandName: 'splitTableCellHorizontally',
                label: 'Neos.Neos.Ui:Main:ckeditor__toolbar__splitTableCellHorizontally'
            }
        ]
    });

    /**
     * Remove formatting
     */
    richtextToolbar.set('removeFormat', {
        commandName: 'removeFormat',
        component: IconButtonComponent,
        callbackPropName: 'onClick',

        icon: 'eraser',
        hoverStyle: 'brand',
        tooltip: 'Neos.Neos.Ui:Main:ckeditor__toolbar__remove-format',
        isVisible: editorOptions => editorOptions?.formatting?.removeFormat
    });

    return richtextToolbar;
};
