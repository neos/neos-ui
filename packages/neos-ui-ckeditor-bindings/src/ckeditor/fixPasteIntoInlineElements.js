import removeTags from './removeTags';

/* eslint babel/new-cap: 0 */
export default CKEDITOR => {
    function paste(event) {
        const {editor} = event;
        const editable = editor.editable();
        if (!CKEDITOR.dtd.$block[editable.getName()]) {
            // For INLINE elements like SPANs, we need to do extra magic to make copy/paste behave well;
            // namely we can only insert plain text instead of styled markup; otherwise CKEditor breaks
            // the editable into two halves, resulting in markup such as:
            //     <span contenteditable="true" property="myProp">before caret</span>
            //     the stuff copy pasted goes here
            //     <span contenteditable="true" property="myProp">after caret</span>
            // ... which of course is totally wrong; breaking inline editing etc etc.
            //
            // The splitting (which breaks our necks) is implemented in "editable.js" inside CKEditor; inside the private function "insert()".
            // That's why we completely handle the paste manually.
            //
            // As a SOLUTION, we insert plain text into the editable using a quite low-level method - this is what this function does:

            // 1) cancel the "paste" event to be able to handle pasting ourselves
            event.cancel();

            const text = removeTags(event.data.dataValue, CKEDITOR);

            // 4) do the actual paste; modelled after CKEDITOR.editable.insertHtml().
            // 4a) we store an undo-snapshot
            editor.fire('saveSnapshot');
            const ranges = editor.getSelection().getRanges();
            if (ranges.length) {
                const range = ranges[0];
                // 4b) then we manually insert text -- this works WITHOUT splitting the span into different parts.
                range.insertNode(new CKEDITOR.dom.text(text));
                // 4c) then, we move the cursor to the end of the just inserted text.
                range.setStart(range.endContainer, range.endOffset);
                range.select();
            }
            // 4d) finally, we store another undo snapshot (after the whole execution completed)
            setTimeout(() => editor.fire('saveSnapshot'), 0);
        }
    }

    CKEDITOR.plugins.add('neos_fixPasteIntoInlineElements', {
        init(editor) {
            editor.on('paste', paste);
        }
    });
};
