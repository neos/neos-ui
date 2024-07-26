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

import I18n from '@neos-project/neos-ui-i18n';

import {AnyError, isECMAScriptError, isServerSideError, isStringError} from '../../types';

import style from './style.module.css';

export const ErrorView: React.FC<{ error: null | AnyError }> = (props) => {
    return (
        <div className={style.container}>
            <ErrorMessage error={props.error} />
            {isDevelopmentContext() ? (
                <ErrorDetails error={props.error} />
            ) : null}
        </div>
    );
};

const ErrorMessage: React.FC<{ error: null | AnyError }> = (props) => {
    if (isECMAScriptError(props.error)) {
        return (<>{props.error.message}</>);
    }

    if (isServerSideError(props.error)) {
        return (<>#{props.error.code}: {props.error.message}</>);
    }

    if (isStringError(props.error)) {
        return (<>{props.error}</>);
    }

    return (
        <I18n
            id="Neos.Neos.Ui:Error:unknown"
            fallback="An unkown error ocurred."
            />
    );
};

const isDevelopmentContext = () => {
    const env = ((window as any).appContainer?.dataset?.env ?? '') as string;

    return (
        env === 'Development'
        || env.startsWith('Development/')
    );
};

const ErrorDetails: React.FC<{ error: null | AnyError }> = (props) => {
    if (isECMAScriptError(props.error)) {
        return (
            <details className={style.details}>
                <summary>Show error details</summary>

                <dl>
                    <dd>Origin:</dd>
                    <dt>Client</dt>
                    <dd>Name:</dd>
                    <dt><code>{props.error.name}</code></dt>
                    {props.error.stack ? (
                        <>
                            <dd>Stacktrace:</dd>
                            <dt className={style.trace}>
                                <pre>{props.error.stack}</pre>
                            </dt>
                        </>
                    ) : null}
                </dl>
            </details>
        );
    }

    if (isServerSideError(props.error)) {
        return (
            <details className={style.details}>
                <summary>Show error details</summary>

                <dl>
                    <dd>Origin:</dd>
                    <dt>Server</dt>
                    <dd>Class:</dd>
                    <dt><code>{props.error.class}</code></dt>
                    <dd>Code:</dd>
                    <dt><code>{props.error.code}</code></dt>
                    <dd>Stacktrace:</dd>
                    <dt className={style.trace}>
                        <pre>{props.error.trace}</pre>
                    </dt>
                </dl>
            </details>
        );
    }

    return null;
}
