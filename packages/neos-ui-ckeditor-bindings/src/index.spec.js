import test from 'ava';

import './index';

test(`should create a global, read-only object`, t => {
    t.not(window['@Neos.Neos.Ui:CKEditorApi'], undefined);

    const shouldThrow = () => {
        window['@Neos.Neos.Ui:CKEditorApi'] = 'I rudely overwrite the CK editor api!';
    };

    t.throws(shouldThrow);
});
