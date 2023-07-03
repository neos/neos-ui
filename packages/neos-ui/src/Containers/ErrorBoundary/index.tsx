import React from 'react';
import styles from './style.module.css';

// @ts-ignore
import Logo from '@neos-project/react-ui-components/src/Logo';
import Button from '@neos-project/react-ui-components/src/Button';
import Icon from '@neos-project/react-ui-components/src/Icon';
import {I18nRegistry} from '@neos-project/neos-ts-interfaces';

class ErrorBoundary extends React.Component<
    { children: React.ReactNode, i18nRegistry: I18nRegistry },
    { error: any }
> {
    public state = {error: undefined};

    public static getDerivedStateFromError(error: any): {error: any} {
        return {error};
    }

    public render(): React.ReactNode {
        if (this.state.error !== undefined) {
            return <ErrorFallback error={this.state.error} i18nRegistry={this.props.i18nRegistry} />;
        }
        return this.props.children;
    }
}

const CopyTechnicalDetailsButton = (props: { error: any, i18nRegistry: I18nRegistry } ) => {
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
        {!hasCopied ?
            props.i18nRegistry.translate('Neos.Neos.Ui:Main:errorBoundary.copyTechnicalDetails')
            : props.i18nRegistry.translate('Neos.Neos.Ui:Main:errorBoundary.technicalDetailsCopied')}
        &nbsp; <Icon icon="copy" size="sm"/>
    </Button>;
};

const ReloadNeosUiButton = (props: { i18nRegistry: I18nRegistry }) => {
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
        {props.i18nRegistry.translate('Neos.Neos.Ui:Main:errorBoundary.reloadUi')}
        &nbsp; <Icon icon="redo" size="sm" spin={isReloading}/>
    </Button>;
};

const ErrorFallback = (props: { error: any, i18nRegistry: I18nRegistry }) => {
    return <div className={styles.container}>
        <div>
            <Logo />
            <h1 className={styles.title}>{props.i18nRegistry.translate('Neos.Neos.Ui:Main:errorBoundary.title')}</h1>
            <p>{props.i18nRegistry.translate('Neos.Neos.Ui:Main:errorBoundary.description')}</p>

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
            <p>{props.i18nRegistry.translate('Neos.Neos.Ui:Main:errorBoundary.footer')}</p>

            <div className={styles.buttonGroup}>
                <ReloadNeosUiButton i18nRegistry={props.i18nRegistry} />
                <CopyTechnicalDetailsButton error={props.error} i18nRegistry={props.i18nRegistry} />
            </div>
        </div>
    </div>;
};

export default ErrorBoundary;
