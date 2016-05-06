export const handle = (events, handler, ...modifier) => dom => {
    const removers = events.split(' ').map(
        event => {
            const listener = e => {
                handler(e);
                modifier.forEach(m => m(e));
            };

            dom.addEventListener(event, listener);

            return () => dom.removeEventListener(event, listener);
        }
    );

    return () => removers.forEach(remover => remover());
};

export const handleOutside = (events, handler, modifier = []) => dom => {
    const removers = events.split(' ').map(
        event => {
            const listener = e => {
                if (e['@neos/inline-ui-event']) {
                    return;
                }
                const check = el => el === dom || (el && check(el.parentNode));

                if (!check(e.target)) {
                    handler(e);
                    modifier.forEach(m => m(e));
                }
            };

            document.addEventListener(event, listener);

            return () => document.removeEventListener(event, listener);
        }
    );

    return () => removers.forEach(remover => remover());
};

export const stopPropagation = e => e.stopPropagation();
export const preventDefault = e => e.preventDefault();

export const position = dom => {
    if (dom && dom.getBoundingClientRect) {
        const bodyBounds = document.body.getBoundingClientRect();
        const domBounds = dom.getBoundingClientRect();

        return {
            x: domBounds.left - bodyBounds.left,
            y: domBounds.top - bodyBounds.top
        };
    }

    return {x: 0, y: 0};
};
