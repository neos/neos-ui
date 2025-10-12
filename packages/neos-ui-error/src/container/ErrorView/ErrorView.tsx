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

import {translate} from '@neos-project/neos-ui-i18n';
import {isDevelopmentContext} from '@neos-project/neos-ui/systemEnv';

import {
    AnyError,
    AnyFlatError,
    isECMAScriptError,
    isNestedError,
    isServerSideError,
    isStringError,
    flattenError
} from '../../types';

import style from './style.module.css';
import {Icon} from '@neos-project/react-ui-components';

export const ErrorView = (props: { error: AnyError }) => {
    const flatError = flattenError(props.error);

    return (
        <div className={style.container}>
            <div>
                <Icon icon="exclamation-triangle" /> {getErrorNameLabel(flatError)}
            </div>
            <ErrorMessage error={flatError} />
            {isNestedError(props.error) ? (
                <NestedErrorChain error={props.error.previous} level={0} />
            ) : null}
            {isDevelopmentContext() ? (
                <ErrorDetails error={flatError} />
            ) : null}
        </div>
    );
};

const NestedErrorChain: React.FC<{
    error: AnyError
    level: number
}> = props => {
    const flatError = flattenError(props.error);

    return (
        <details className={style.details}>
            <summary>Cause: {getErrorNameLabel(flatError)}</summary>

            <ErrorMessage error={flatError} />
            {isDevelopmentContext() ? (
                <ErrorDetails error={flatError} />
            ) : null}
            {isNestedError(props.error) && props.level < 10 ? (
                <NestedErrorChain error={props.error.previous} level={props.level + 1}/>
            ) : null}
        </details>
    );
}

const ErrorMessage: React.FC<{ error: AnyFlatError }> = (props) => {
    if (isECMAScriptError(props.error)) {
        return (<>{props.error.message}</>);
    }

    if (isServerSideError(props.error)) {
        return (<>#{props.error.code}: {props.error.message}</>);
    }

    if (isStringError(props.error)) {
        return (<>{props.error}</>);
    }

    return (<>{translate('Neos.Neos.Ui:Error:unknown', 'An unknown error occurred.')}</>);
};

const getErrorNameLabel = (error: AnyFlatError) => {
    if (isECMAScriptError(error)) {
        return error.name;
    }

    if (isStringError(error)) {
        return 'Error';
    }

    if (isServerSideError(error)) {
        return 'ServerSideError: ' + error.class;
    }

    return 'Unknown Error';
}

const ErrorDetails: React.FC<{ error: AnyFlatError }> = (props) => {
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
                    {
                        props.error.trace ? (<>
                            <dd>Stacktrace:</dd>
                            <dt className={style.trace}>
                                <pre>{props.error.trace}</pre>
                            </dt>
                        </>) : null
                    }
                </dl>
            </details>
        );
    }

    return null;
}
