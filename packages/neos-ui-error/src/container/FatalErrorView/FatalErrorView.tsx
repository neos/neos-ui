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

// @ts-ignore
import Logo from '@neos-project/react-ui-components/src/Logo';
import Button from '@neos-project/react-ui-components/src/Button';
import Icon from '@neos-project/react-ui-components/src/Icon';
import {translate} from '@neos-project/neos-ui-i18n';

import styles from './style.module.css';
import {AnyError} from "../../types";

const CopyTechnicalDetailsButton = (props: { error: null | AnyError }) => {
    const [hasCopied, setCopied] = React.useState(false);

    const copyErrorDetails = () => {
        setCopied(true);
        const error = props.error as Error;
        window.navigator.clipboard.writeText(`Name: ${error.name}\n\nMessage: ${error.message}\n\nStacktrace: ${error.stack}`);
    };

    if (!window.navigator.clipboard || !(props.error instanceof Error)) {
        return null;
    }

    return <Button onClick={copyErrorDetails} isActive={hasCopied}>
        {!hasCopied
            ? translate('Neos.Neos.Ui:Main:errorBoundary.copyTechnicalDetails', '')
            : translate('Neos.Neos.Ui:Main:errorBoundary.technicalDetailsCopied', '')
        }
        &nbsp; <Icon icon="copy" size="sm"/>
    </Button>;
};

const ReloadNeosUiButton = () => {
    const [isReloading, setReload] = React.useState(false);
    const reload = () => {
        if (isReloading) {
            return;
        }
        setReload(true);
        setTimeout(() => {
            document.location.reload();
        }, 100);
    };

    return <Button onClick={reload}>
        {translate('Neos.Neos.Ui:Main:errorBoundary.reloadUi', '')}
        &nbsp; <Icon icon="redo" size="sm" spin={isReloading}/>
    </Button>;
};

export const FatalErrorView = (props: { error: null | AnyError }) => {
    return <div className={styles.container}>
        <div>
            <Logo />
            <h1 className={styles.title}>{translate('Neos.Neos.Ui:Main:errorBoundary.title', '')}</h1>
            <p>{translate('Neos.Neos.Ui:Main:errorBoundary.description', '')}</p>

            {props.error instanceof Error &&
                <>
                    <p>
                        Name: {props.error.name || '-'}
                    </p>
                    <p>
                        Message: {props.error.message || '-'}
                    </p>
                    <p>Stacktrace:</p>
                    <pre className={styles.stackTrace}>
                        <code>
                            {props.error.stack}
                        </code>
                    </pre>
                </>
            }
            <p>{translate('Neos.Neos.Ui:Main:errorBoundary.footer', '')}</p>

            <div className={styles.buttonGroup}>
                <ReloadNeosUiButton />
                <CopyTechnicalDetailsButton error={props.error} />
            </div>
        </div>
    </div>;
};
