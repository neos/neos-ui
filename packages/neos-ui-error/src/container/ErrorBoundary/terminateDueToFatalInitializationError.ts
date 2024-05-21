/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import logo from '@neos-project/react-ui-components/src/Logo/logo.svg';

import styles from './style.module.css';

export function terminateDueToFatalInitializationError(reason: string): never {
    if (!document.body) {
        throw new Error(reason);
    }

    document.title = 'The Neos UI could not be initialized.';
    document.body.innerHTML = `
        <div class="${styles.container}">
            <div>
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
