import createEditor from 'Guest/Components/Editors/CreateEditor/index';

import createCKEditorInstance from './CreateCKEditorInstance/index';
import getSelectionData from './Selection/index';

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
        (config, api, connection, dom) => {
            const ckInstance = createCKEditorInstance(ckApi, api, dom, getSelectionData(ckApi));
            ckInstance.on('change', () => console.log('change :)') || api.commit(ckInstance.getData()));
        }
    );
};

export default editor(window.CKEDITOR);
