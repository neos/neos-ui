import createEditor from 'Guest/Components/Editors/CreateEditor/index';

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
            const ckInstance = ckApi.inline(dom, {
                removePlugins: 'toolbar',
                allowedContent: true
            });

            ckInstance.on('change', () => api.commit(ckInstance.getData()));
            document.addEventListener('mouseup', ev => {
				if (ev.button !== 0 || ev.ctrlKey || ev.altKey || ev.shiftKey) {
                    return true;
                }

				setTimeout(() => {
                    const selection = ckInstance.getSelection();
                    const nativeSelection = selection.getNative();
                    if (nativeSelection) {
                        const range = nativeSelection.getRangeAt(0);
                        const {top, left} = range.getBoundingClientRect();

    					if (ckInstance.getSelection().getSelectedText() != '') {
                            console.log('show toolbar', {top, left});
    					} else {
    						console.log('hide toolbar');
    					}
                    }
				}, 100);
			});
        }
    );
};

export default editor(window.CKEDITOR);
