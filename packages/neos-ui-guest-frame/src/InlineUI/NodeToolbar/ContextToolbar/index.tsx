import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import mergeClassNames from 'classnames';
import debounce from 'lodash.debounce';

// @ts-ignore
import {findNodeInGuestFrame, getGuestFrameWindow} from '@neos-project/neos-ui-guest-frame/src/dom';
import {isPropertyPartiallyVisible} from '@neos-project/neos-ui-guest-frame/src/ToolbarAnchoring';
import {Icon, Button} from '@neos-project/react-ui-components';
import {translate} from '@neos-project/neos-ui-i18n';
import {neos} from '@neos-project/neos-ui-decorators';
import {selectors, useSelector} from '@neos-project/neos-ui-redux-store';
import {NodeTypesRegistry} from '@neos-project/neos-ui-contentrepository';
import {SynchronousRegistry, GlobalRegistry} from '@neos-project/neos-ui-registry';
import {decodeHtml} from '@neos-project/utils-helpers';

import style from './style.module.css';

type InjectedContextToolbarProps = {
    nodeTypesRegistry: NodeTypesRegistry;
    guestFrameRegistry: SynchronousRegistry<any>;
}

const withNeosGlobals = neos<ContextToolbarProps, InjectedContextToolbarProps>((globalRegistry: GlobalRegistry) => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository'),
    // @ts-ignore
    guestFrameRegistry: globalRegistry.get('@neos-project/neos-ui-guest-frame')
}));

type ContextToolbarProps = {
    buttonProps?: { [key: string]: any };
    fusionPath: string | undefined;
}

/**
 * The ContextToolbar contains buttons for context specific operations on nodes,
 * like copying, hiding, moving deleting the focused node.
 */
const ContextToolbar: React.FC<ContextToolbarProps & InjectedContextToolbarProps> = ({
    buttonProps,
    nodeTypesRegistry,
    guestFrameRegistry,
    fusionPath
}) => {
    const focusedNode = useSelector(selectors.CR.Nodes.focusedSelector);
    const iframeWindow = useRef(getGuestFrameWindow()).current;
    const [isSticky, setIsSticky] = useState(false);
    const debouncedStickyRef = useRef<any>();

    const focusedNodeLabel = useMemo(() => {
        return focusedNode ? decodeHtml(focusedNode.label) : '';
    }, [focusedNode])

    const updateStickiness = useCallback(() => {
        if (!focusedNode) {
            return;
        }
        const nodeElement = findNodeInGuestFrame(focusedNode.contextPath, fusionPath);
        if (nodeElement) {
            setIsSticky(isPropertyPartiallyVisible(nodeElement.getBoundingClientRect()));
        }
    }, [focusedNode, fusionPath]);

    useEffect(() => {
        debouncedStickyRef.current = debounce(updateStickiness, 5);

        return () => {
            if (debouncedStickyRef.current && debouncedStickyRef.current.cancel) {
                debouncedStickyRef.current.cancel();
            }
        }
    }, [updateStickiness]);

    useEffect(() => {
        if (!iframeWindow) {
            return;
        }

        iframeWindow.addEventListener('scroll', debouncedStickyRef.current);
        updateStickiness();

        return () => {
            iframeWindow.removeEventListener('scroll', debouncedStickyRef.current);
        };
    }, [updateStickiness]);

    const focusedNodeType = focusedNode ? nodeTypesRegistry.get(focusedNode.nodeType) : null;
    const focusedNodeTypeIcon = focusedNodeType?.ui?.icon || 'cube';

    const buttons = guestFrameRegistry.getChildren('NodeToolbar/SecondaryButtons');
    const contextButtons = guestFrameRegistry.getChildren('NodeToolbar/ContextButtons');

    const classNames = mergeClassNames({
        [style.contextToolBar]: true,
        [style['contextToolBar--isSticky']]: isSticky
    });

    // The data attribute data-ignore_click_outside is used to disable the enhanceWithClickOutside
    // handling. For the special case that the outOfBandRender returns an empty rendered content
    // we need to disable the enhanceWithClickOutside handling to prevent hick ups in the event
    // registration after guest frame reload.
    return (
        <div className={classNames} id="neos-ContextToolbar">
            <div className={style.toolBar} data-ignore_click_outside="true">
                {contextButtons.map((Item, key) => <Item key={key} {...buttonProps} />)}
                <div className={style.toolBar__contextMenuWrapper}>
                    <Button
                        className={style.contextToolbar__nodeLabel}
                        popovertarget="neos-ContextToolbar-ContextMenu"
                        title={translate('Neos.Neos.Ui:Main:toggleContextMenu', 'Toggle context menu')}
                        hoverStyle="brand"
                        style="transparent"
                        size="small"
                    >
                        <Icon icon={focusedNodeTypeIcon}/>
                        <span>{focusedNodeLabel}</span>
                        <Icon icon="ellipsis-vertical"/>
                    </Button>
                    <div
                        id="neos-ContextToolbar-ContextMenu"
                        className={style.toolBar__contextMenu}
                        popover="auto"
                    >
                        <div className={style.toolBar__btnGroupVertical}>
                            {buttons.map((Item, key) => <Item key={key} {...buttonProps} />)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default React.memo(withNeosGlobals(ContextToolbar as any));
