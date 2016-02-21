import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';
import createElement from 'virtual-dom/create-element';

//
// Helps to render VDOM nodes
//
export default (component, initialProps) => {
    const update = (props = initialProps) => {
        const next = component({
            ...props,
            onUpdate: update
        });
        patch(dom, diff(vnode, next)); // eslint-disable-line no-use-before-define
        vnode = next; // eslint-disable-line no-use-before-define
    };
    let vnode = component({
        ...initialProps,
        onUpdate: update
    });
    const dom = createElement(vnode);

    return {
        dom,
        update
    };
};
