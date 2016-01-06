export default function filterDeep(arg, cb) {
    let result = null;

    if (cb(arg)) {
        return arg;
    } else if (arg.children) {
        return filterDeep(arg.children, cb);
    } else if (Array.isArray(arg)) {
        arg.forEach(item => {
            if (result === null) {
                result = filterDeep(item, cb);
            }
        });
    }

    return result;
}
