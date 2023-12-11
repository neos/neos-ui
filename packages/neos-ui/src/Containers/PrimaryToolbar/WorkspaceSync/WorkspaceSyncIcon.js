/* eslint-disable complexity */
import React from 'react';
import Icon from '@neos-project/react-ui-components/src/Icon/';
import style from './style.module.css';
import mergeClassNames from 'classnames';
import {WorkspaceStatus} from '@neos-project/neos-ts-interfaces';

const WorkspaceSyncIcon = ({personalWorkspaceStatus, onDarkBackground}) => {
    const iconBadgeClassNames = mergeClassNames({
        [style.badgeIconBackground]: typeof onDarkBackground === 'undefined' || onDarkBackground === false,
        [style.badgeIconOnDarkBackground]: onDarkBackground === true,
        'fa-layers-counter': true,
        'fa-layers-bottom-right': true,
        'fa-2x': true
    });
    const iconLayerClassNames = mergeClassNames({
        [style.iconLayer]: true,
        'fa-layers': true,
        'fa-fw': true
    });
    const iconBadge = personalWorkspaceStatus === WorkspaceStatus.OUTDATED_CONFLICT ? (
        <span className={iconBadgeClassNames}>
            <Icon icon="exclamation"/>
        </span>
    ) : null

    return (
        <span className={iconLayerClassNames}>
            <Icon icon="sync" size="1x"/>
            {iconBadge}
        </span>
    )
}

export default WorkspaceSyncIcon;
