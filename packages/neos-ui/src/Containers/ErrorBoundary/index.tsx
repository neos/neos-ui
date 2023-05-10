import React from 'react';
import styles from './style.module.css';
import {Logo, Button, Icon} from '@neos-project/react-ui-components';

class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { error: any }
> {
    state = {error: undefined};

    static getDerivedStateFromError(error: any) {
        return {error};
    }

    render() {
        if (this.state.error !== undefined) {
            return <ErrorFallback error={this.state.error} />;
        }
        return this.props.children;
    }
}

const CopyTechnicalDetailsButton = (props: { error: any }) => {
    const [hasCopied, setCopied] = React.useState(false);

    const copyErrorDetails = () => {
        setCopied(true);
        const error = props.error as Error;
        window.navigator.clipboard.writeText(`Name: ${error.name}\n\nMessage: ${error.message}\n\nStacktrace: ${error.stack}`);
    }

    if (!window.navigator.clipboard || !(props.error instanceof Error)) {
        return null;
    }

    return <Button onClick={copyErrorDetails} isActive={hasCopied}>{!hasCopied ? 'Copy technical details' : 'Technical details copied'} &nbsp; <Icon icon="copy" size="sm"/></Button>
}

const ReloadNeosUiButton = () => {
    const [isReloading, setReload] = React.useState(false);
    const reload = () => {
        if (isReloading) {
            return;
        }
        setReload(true);
        setTimeout(() => {
            document.location.reload();
        }, 100)
    }

    return <Button onClick={reload}>Reload Neos UI &nbsp; <Icon icon="redo" size="sm" spin={isReloading}/></Button>;
}

const ErrorFallback = (props: { error: any }) => {
    // @ts-ignore
    const isDev = window.neos?.systemEnv.startsWith('Development');

    return <div className={styles.container}>
        <div>
            {isDev
                ? <img style={{height: '48px'}} src="/_Resources/Static/Packages/Neos.Neos.UI/Images/neos-logo-enhanced.gif" title="This... This can't be. We programm without bugs." alt="Neos Logo" />
                : <Logo />
            }
            <h1 className={styles.title}>Sorry, but the Neos UI could not recover from this Error.</h1>
            <p>Please reload the application, or contact your system administrator with the given details.</p>

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
            <p>For more information about the Error please refer to the JavaScript console.</p>

            <div className={styles.buttonGroup}>
                <ReloadNeosUiButton />
                <CopyTechnicalDetailsButton error={props.error} />
            </div>
        </div>
    </div>
};

export default ErrorBoundary;
