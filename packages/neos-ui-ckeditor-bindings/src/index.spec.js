import test from 'ava';

//
// Mock CKEditor API
//
window.CKEDITOR = {
    dtd: {
        $editable: {}
    }
};

//
// Index needs to be required, so the above mock will be respected
//
require('./index');

test(`should create a global, read-only object`, t => {
    t.not(window['@Neos.Neos.Ui:CKEditorApi'], undefined);

    const shouldThrow = () => {
        window['@Neos.Neos.Ui:CKEditorApi'] = 'I rudely overwrite the CK editor api!';
    };

    t.throws(shouldThrow);
});
