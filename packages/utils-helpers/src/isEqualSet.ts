const isEqualSet = (a: [], b: []) => {
    const unionSize = new Set([...a, ...b]).size;
    return unionSize !== 0 && unionSize === a.length && unionSize === b.length;
};
export default isEqualSet;
