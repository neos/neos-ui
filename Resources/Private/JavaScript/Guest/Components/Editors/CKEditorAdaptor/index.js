import createEditor from 'Guest/Components/Editors/CreateEditor/index';
import render from 'Guest/Process/Render.js';

import createCKEditorInstance from './CreateCKEditorInstance/index';
import getSelectionData from './Selection/index';
import createToolbar from './CKEditorToolbar/index';

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
        (config, api, dom) => {
            const toolbar = render(createToolbar(), {});
            const ckInstance = createCKEditorInstance(ckApi, dom, getSelectionData(ckApi), toolbar);

            ckInstance.on('change', () => api.commit(ckInstance.getData()));

            document.body.appendChild(
                toolbar.dom
            );
        }
    );
};

export default editor(window.CKEDITOR);
