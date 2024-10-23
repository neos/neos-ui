import logoSvg from '@neos-project/react-ui-components/src/Logo/resource/logo.svg';
import styles from '../Containers/ErrorBoundary/style.module.css';

export function terminateDueToFatalInitializationError(reason) {
    if (!document.body) {
        throw new Error(reason);
    }

    document.title = 'The Neos UI could not be initialized.';
    document.body.innerHTML = `
        <div class="${styles.container}">
            <div>
                <span class="${styles.logo}">${logoSvg}</span>
                <h1 class="${styles.title}">
                    Sorry, but the Neos UI could not be initialized.
                </h1>
                ${reason}
            </div>
        </div>
    `;

    throw new Error(document.body.innerText);
}
