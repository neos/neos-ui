import createEditor from 'Guest/Components/Editors/CreateEditor/index';

import createCKEditorInstance from './Factory/index';

export const editor = ckApi => {
    if (!ckApi) {
        console.error('CKEditor not found!');

        //
        // Return noop to not break things
        //
        return () => {};
    }

    ckApi.disableAutoInline = true;

    return createEditor(
        (node, property, api, connection, dom) => {
            const ckInstance = createCKEditorInstance(node, property, ckApi, api, dom);
            ckInstance.on('change', () => api.commit(ckInstance.getData()));
        }
    );
};

export default editor(window.CKEDITOR);
