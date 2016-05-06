import * as EditorToolbar from './EditorToolbar/index';

export default [
    ...Object.keys(EditorToolbar).map(key => EditorToolbar[key])
];
