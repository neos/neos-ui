import * as PageTree from './PageTree/index';
import * as Inspector from './Inspector/index';

export default [
    ...Object.keys(PageTree).map(k => PageTree[k]),
    ...Object.keys(Inspector).map(k => Inspector[k])
];
