import {SynchronousRegistry} from '@neos-project/neos-ui-extensibility/src/registry';

export default class CkEditorFormattingRulesRegistry extends SynchronousRegistry {
    constructor(...args) {
        super(...args);

        /**
         * Helper to expand the current selection to the currently-selected word
         * @param editor
         * @param CKEDITOR
         */
        this.expandCollapsedSelectionToCurrentWord = (editor, CKEDITOR) => {
            const selection = editor.getSelection();
            const range = selection.getRanges()[0];

            if (range.collapsed) {
                // Range is collapsed; so we expand it!
                const startNode = range.startContainer;
                if (startNode.type === CKEDITOR.NODE_TEXT && range.startOffset) {
                    let indexPrevSpace = startNode.getText().lastIndexOf(' ', range.startOffset) + 1;
                    let indexNextSpace = startNode.getText().indexOf(' ', range.startOffset);

                    if (indexPrevSpace === -1) {
                        indexPrevSpace = 0;
                    }
                    if (indexNextSpace === -1) {
                        indexNextSpace = startNode.getText().length;
                    }

                    range.setStart(startNode, indexPrevSpace);
                    range.setEnd(startNode, indexNextSpace);
                    editor.getSelection().selectRanges([range]);
                }
            }
        };

        this.config = {

            /**
             * add a tag name to the CKEditor block-level formatting config "format_tags",
             * and ensure the "Format" selector is visible
             */
            addToFormatTags: tagName =>
                config => {
                    if (config.format_tags) { // eslint-disable-line camelcase
                        config.format_tags += ';'; // eslint-disable-line camelcase
                    } else {
                        config.format_tags = ''; // eslint-disable-line camelcase
                    }

                    config.format_tags += tagName; // eslint-disable-line camelcase

                    config = this.config.add('Format')(config);

                    return config;
                },
            /**
             * adds the given "buttonName" to the list of enabled buttons, i.e. configuring ACF for them correctly
             */
            add: buttonName =>
                config => {
                    if (!config.buttons) {
                        config.buttons = [];
                    }
                    if (config.buttons.indexOf(buttonName) === -1) {
                        config.buttons.push(buttonName);
                    }

                    return config;
                },
            /**
             * adds the given "expression" to the list of extraAllowedContent
             */
            addToExtraAllowedContent: extraExpression =>
                config => {
                    if (config.extraAllowedContent) {
                        config.extraAllowedContent += ' ' + extraExpression;
                    } else {
                        config.extraAllowedContent = extraExpression;
                    }

                    return config;
                }
        };
    }
}
