/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import React from 'react';
import mergeClassNames from 'classnames';

import {IconButton, Icon} from '@neos-project/react-ui-components';

import {Severity} from '../../types';

import style from './style.module.css';

export const FlashMessage: React.FC<{
    id: string;
    message: string;
    severity: Severity;
    timeout?: number;

    onClose: (id: string) => void;
}> = (props) => {
    const {message, severity} = props;
    const isSuccess = severity === 'success';
    const isError = severity === 'error';
    const isInfo = severity === 'info';
    const isClosing = React.useRef(false);
    const handleClose = React.useCallback(() => {
        const {onClose, id} = props;

        if (!isClosing.current) {
            isClosing.current = true;
            setTimeout(() => onClose(id), 100);
        }
    }, [props.id]);

    const flashMessageClasses = mergeClassNames({
        [style.flashMessage]: true,
        [style['flashMessage--success']]: isSuccess,
        [style['flashMessage--error']]: isError,
        [style['flashMessage--info']]: isInfo
    });

    const iconName = mergeClassNames({
        check: isSuccess,
        ban: isError,
        info: isInfo
    }) || 'info';

    React.useEffect(
        () => {
            if (props.timeout) {
                const timeout = setTimeout(handleClose, props.timeout);
                return () => {
                    clearTimeout(timeout);
                };
            }

            return () => {};
        },
        [handleClose, props.timeout]
    );

    return (
        <div className={flashMessageClasses} role="alert">
            <Icon icon={iconName} className={style.flashMessage__icon}/>
            <div className={style.flashMessage__heading}>{message}</div>
            <IconButton
                icon="times"
                className={style.flashMessage__btnClose}
                size="regular"
                style="transparent"
                hoverStyle="darken"
                onClick={handleClose}
                />
        </div>
    );
}
