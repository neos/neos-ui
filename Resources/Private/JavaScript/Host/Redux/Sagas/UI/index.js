import * as PageTree from './PageTree/index';

export default [
    ...Object.keys(PageTree).map(k => PageTree[k])
];
