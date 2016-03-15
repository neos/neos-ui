import * as PageTree from './PageTree/index';
import * as Plugin from './Plugin/index';

export default [
    ...Object.keys(PageTree).map(k => PageTree[k]),
    ...Object.keys(Plugin).map(k => Plugin[k])
];
