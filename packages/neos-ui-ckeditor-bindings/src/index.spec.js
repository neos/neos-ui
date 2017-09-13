window.CKEDITOR = {
    dtd: {
        $editable: {}
    },
    plugins: {
        add: () => {}
    }
};

//
// Index needs to be required, so the above mock will be respected
//
require('./index');

test(`should create a global, read-only object`, () => {
    expect(window.NeosCKEditorApi).not.toBe(undefined);

    const shouldThrow = () => {
        window.NeosCKEditorApi = 'I rudely overwrite the CK editor api!';
    };

    expect(shouldThrow).toThrow();
});
