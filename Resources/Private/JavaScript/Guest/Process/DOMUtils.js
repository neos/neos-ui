export const handle = (events, handler, ...modifier) => dom => {
    events.split(' ').forEach(
        event => dom.addEventListener(event, e => {
            handler(e);
            modifier.forEach(m => m(e));
        })
    );

    return dom;
};

export const handleOutside = (events, handler, modifier = []) => dom => {
    events.split(' ').forEach(
        event => document.addEventListener(event, e => {
            const check = el => el === dom || (el && check(el.parentNode));

            if (!check(e.target)) {
                handler(e);
                modifier.forEach(m => m(e));
            }
        })
    );

    return dom;
};

export const stopPropagation = e => e.stopPropagation();
export const preventDefault = e => e.preventDefault();
