// Code from https://github.com/AlfonsoML/confighelper/blob/master/plugin.js originally, with the following (heavy) modifications:

// If the data is "empty" (BR, P) or the placeholder then return an empty string.
// Otherwise return the original data
const htmlIsEmptyish = data => {
    if (!data) {
        return true;
    }

    if (data.length > 20) {
        return false;
    }

    const value = data.replace(/[\n|\t|\u200b]*/g, '').toLowerCase().trim();
    return (
        !value ||
        value === '<br>' ||
        value === '<p>&nbsp;<br></p>' ||
        value === '<p><br></p>' ||
        value === '<p>&nbsp;</p>' ||
        value === '&nbsp;' ||
        value === '&nbsp;<br>' ||
        value === ' <br>' ||
        value.match(/^<([a-z0-9]+)><br><\/\1>$/)
    );
};

export default CKEDITOR => {
    function addPlaceholder(event) {
        const editor = event.editor;
        const editable = editor.editable();
        if (!editable) {
            return;
        }

        if (editor.mode === 'wysiwyg') {
            // we only support wysiwyg editor mode
            // If the blur is due to a dialog, don't apply the placeholder
            if (CKEDITOR.dialog._.currentTop) {
                return;
            }

            if (htmlIsEmptyish(editable.getHtml())) {
                editable.setHtml(editor.config.neosPlaceholder);
                editable.addClass('placeholder');
            }
        }
    }

    function removePlaceholder(event) {
        const editor = event.editor;
        const editable = editor.editable();
        if (!editable) {
            return;
        }

        if (editor.mode === 'wysiwyg') {
            if (!editable.hasClass('placeholder')) {
                // no placeholder, so nothing to be removed.
                return;
            }

            editable.removeClass('placeholder');

            // IF: editable allows a "P" inside, we create a "newline".
            // NOTE: this condition might not be good enough; we might need to check for block level elements using CKEDITOR.dtd.$block
            if (CKEDITOR.dtd[editable.getName()].p) {
                editable.setHtml('<p><br/></p>');
                // Set caret in position
                const range = editor.createRange();
                range.moveToElementEditablePosition(editable.getFirst(), true);
                editor.getSelection().selectRanges([range]);
                editor.editable().$.click();
            } else {
                // if we are inside an inline editable (e.g. a span), we have to set the selection
                // *using a timeout*, otherwise it won't be selected in Firefox and Chrome.
                editable.setHtml(' ');

                window.setTimeout(() => {
                    const range = editor.createRange();
                    range.moveToElementEditablePosition(editable.getFirst(), true);
                    editor.getSelection().selectRanges([range]);
                    editor.editable().$.click();
                }, 5);
            }
        }
    }

    CKEDITOR.plugins.add('neos_placeholder', {
        getPlaceholderCss() {
            return '.placeholder{ color: #999; }';
        },

        onLoad() {
            CKEDITOR.addCss(this.getPlaceholderCss());
        },

        init(editor) {
            if (editor.config.neosPlaceholder) {
                // Watch for the calls to getData to remove the placeholder
                editor.on('getData', event => {
                    const element = editor.editable();

                    if (element && element.hasClass('placeholder')) {
                        event.data.dataValue = '';
                    }
                });

                // Watch for setData to remove placeholder class
                editor.on('setData', event => {
                    if (CKEDITOR.dialog._.currentTop) {
                        return;
                    }

                    const editable = editor.editable();

                    if (!editable) {
                        return;
                    }

                    if (htmlIsEmptyish(event.data.dataValue)) {
                        // if data is empty, set it to the placeholder
                        addPlaceholder(event);
                    } else if (editable.hasClass('placeholder')) {
                        // Remove the class if new data is not empty
                        editable.removeClass('placeholder');
                    }
                });

                editor.on('mode', addPlaceholder);
                editor.on('blur', addPlaceholder);
                editor.on('contentDom', addPlaceholder);
                editor.on('focus', removePlaceholder);
                editor.on('beforeModeUnload', removePlaceholder);
            }
        }
    });
};
