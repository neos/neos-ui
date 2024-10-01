import {Logo} from '@neos-project/react-ui-components';

import styles from '../Containers/ErrorBoundary/style.module.css';

export function terminateDueToFatalInitializationError(reason) {
    if (!document.body) {
        throw new Error(reason);
    }

    document.title = 'The Neos UI could not be initialized.';
    document.body.innerHTML = `
        <div class="${styles.container}">
            <div>
                <Logo />
                <img style="height: 24px; width: auto;" src='${logo}' alt="Neos" />
                <h1 class="${styles.title}">
                    Sorry, but the Neos UI could not be initialized.
                </h1>
                ${reason}
            </div>
        </div>
    `;

    throw new Error(document.body.innerText);
}
