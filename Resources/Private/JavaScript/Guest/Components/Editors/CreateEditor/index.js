import debounce from 'lodash.debounce';

import style from './style.css';

export default editorFactory => (nodeContext, dom, ui, connection) => {
    let editor = null;

    const editorApi = {
        commit: debounce(value => ui.addChange({
            type: 'PackageFactory.Guevara:Property',
            subject: nodeContext.contextPath,
            payload: {
                propertyName: nodeContext.propertyName,
                value
            }
        }), 200)
    };

    dom.setAttribute('contentEditable', true);
    dom.classList.add(style.editor);

    connection.observe('nodes.byContextPath', nodeContext.contextPath).react(node => {
        if (node) {
            if (editor) {
                editor.onNodeChange(node);
            } else {
                const handlers = editorFactory(
                    //
                    // Get the configuration for RTE
                    //
                    node.nodeType.properties[nodeContext.propertyName].ui.aloha,

                    //
                    // Pass the API object to the editor
                    //
                    editorApi,

                    //
                    // Pass the dom element
                    //
                    dom,

                    //
                    // Pass the node object
                    //
                    node,

                    //
                    // Pass the property name
                    //
                    nodeContext.propertyName
                );

                editor = Object.assign({
                    onNodeChange: () => {}
                }, handlers);
            }
        }
    });
};
