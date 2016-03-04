import * as PageTree from './PageTree/';

export default [
    ...Object.keys(PageTree).map(k => PageTree[k])
];
