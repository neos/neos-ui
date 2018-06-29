import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import styles from './style.vanilla-css'; // eslint-disable-line no-unused-vars

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
    const a = (
        !value ||
        value === '<br>' ||
        value === '<p>&nbsp;</p>' ||
        value === '<p>&nbsp;<br></p>' ||
        value === '<p><br></p>' ||
        value === '&nbsp;' ||
        value === '&nbsp;<br>' ||
        value === ' <br>' ||
        value.match(/^<([a-z0-9]+)><br><\/\1>$/)
    );
    return a;
};

export default class NeosPlaceholder extends Plugin {
    static get pluginName() {
        return 'NeosPlaceholder';
    }

    addPlaceholder() {
        const placeholder = this.editor.config.get('neosPlaceholder');
        this.editor.element.innerHTML = placeholder;
    }
    removePlaceholder() {
        const placeholder = this.editor.config.get('neosPlaceholder');
        if (this.editor.element.innerHTML === placeholder) {
            this.editor.element.innerHTML = '<p>nbsp;</p>';
        }
    }

    init() {
        if (this.editor.config.get('neosPlaceholder')) {
            const editor = this.editor;
            const model = editor.data.model;

            const update = editor => {
                if (htmlIsEmptyish(editor.getData())) {
                    this.addPlaceholder();
                } else {
                    this.removePlaceholder();
                }
            };

            update(editor);

            model.on('applyOperation', () => {
                update(editor);
                return true;
            });
            editor.ui.focusTracker.on('change:isFocused', event => {
                if (event.source.isFocused) {
                    update(editor);
                }
            });










            // // Watch for the calls to getData to remove the placeholder
            // editor.on('getData', event => {
            //     const element = editor.editable();

            //     if (element && element.hasClass('placeholder')) {
            //         event.data.dataValue = '';
            //     }
            // });

            // // Watch for setData to remove placeholder class
            // editor.on('setData', event => {
            //     if (CKEDITOR.dialog._.currentTop) {
            //         return;
            //     }

            //     const editable = editor.editable();

            //     if (!editable) {
            //         return;
            //     }

            //     if (htmlIsEmptyish(event.data.dataValue)) {
            //         // If data is empty, set it to the placeholder
            //         addPlaceholder(event);
            //     } else if (editable.hasClass('placeholder')) {
            //         // Remove the class if new data is not empty
            //         editable.removeClass('placeholder');
            //     }
            // });

            // editor.on('mode', addPlaceholder);
            // editor.on('blur', addPlaceholder);
            // editor.on('contentDom', addPlaceholder);
            // editor.on('focus', removePlaceholder);
            // editor.on('beforeModeUnload', removePlaceholder);
        }
    }
}












// export default CKEDITOR => {
//     function addPlaceholder(event) {
//         const editor = event.editor;
//         const editable = editor.editable();
//         if (!editable) {
//             return;
//         }

//         if (editor.mode === 'wysiwyg') {
//             // We only support wysiwyg editor mode
//             // If the blur is due to a dialog, don't apply the placeholder
//             if (CKEDITOR.dialog._.currentTop) {
//                 return;
//             }

//             if (htmlIsEmptyish(editable.getHtml())) {
//                 editable.setHtml(editor.config.neosPlaceholder);
//                 editable.addClass('placeholder');
//             }
//         }
//     }

//     function removePlaceholder(event) {
//         const editor = event.editor;
//         const editable = editor.editable();
//         if (!editable) {
//             return;
//         }

//         if (editor.mode === 'wysiwyg') {
//             if (!editable.hasClass('placeholder')) {
//                 // No placeholder, so nothing to be removed.
//                 return;
//             }

//             editable.removeClass('placeholder');

//             // IF: editable allows a "P" inside, we create a "newline".
//             // NOTE: this condition might not be good enough; we might need to check for block level elements using CKEDITOR.dtd.$block
//             if (CKEDITOR.dtd[editable.getName()].p) {
//                 if (editor.config.autoParagraph) {
//                     editable.setHtml('<p><br/></p>');
//                 } else {
//                     editable.setHtml('');
//                 }

//                 // Set caret in position
//                 if (editable.getFirst()) {
//                     const range = editor.createRange();
//                     range.moveToElementEditablePosition(editable.getFirst(), true);
//                     editor.getSelection().selectRanges([range]);
//                 }
//                 editor.editable().$.click();
//             } else {
//                 // If we are inside an inline editable (e.g. a span), we have to set the selection
//                 // *using a timeout*, otherwise it won't be selected in Firefox and Chrome.
//                 editable.setHtml(' ');

//                 window.setTimeout(() => {
//                     if (editable.getFirst()) {
//                         const range = editor.createRange();
//                         range.moveToElementEditablePosition(editable.getFirst(), true);
//                         editor.getSelection().selectRanges([range]);
//                     }
//                     editor.editable().$.click();
//                 }, 5);
//             }
//         }
//     }

// };
