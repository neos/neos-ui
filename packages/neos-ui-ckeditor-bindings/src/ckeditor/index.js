import neosPlaceholder from './neosPlaceholder';
import fixPasteIntoInlineElements from './fixPasteIntoInlineElements';

export default CKEDITOR => {
    neosPlaceholder(CKEDITOR);
    fixPasteIntoInlineElements(CKEDITOR);
};
