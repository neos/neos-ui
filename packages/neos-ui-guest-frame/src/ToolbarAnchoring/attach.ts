import {anchorNameDatasetKey, toolbarClasses} from './classes';
import {readAnchorName, setPositionAnchor} from './dom';
import {ToolbarElements} from './types';

/**
 * Prepares a toolbar element to be placed at the dom node of its edited property.
 * Called once per editor before the first focus: the base class is what hides and
 * anchors the toolbar, so attaching later would leave unfocused toolbars visible.
 */
export const attachToProperty = ({toolbar, property}: ToolbarElements): void => {
    const anchorName = readAnchorName(property);

    toolbar.dataset[anchorNameDatasetKey] = anchorName;
    setPositionAnchor(toolbar, anchorName);
    toolbar.classList.add(toolbarClasses.anchored);
};

export const isAttached = (toolbar: HTMLElement): boolean => toolbar.classList.contains(toolbarClasses.anchored);
