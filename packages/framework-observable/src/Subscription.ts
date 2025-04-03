/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

/**
 * When attaching a Subscriber to an Observable, a Subscription is returned.
 * The `unsubscribe` method of the Subscription allows you to detach the
 * Subscriber from the Observable again, after which the Subscriber no longer
 * receives any values emitted from the Observable.
 */
export interface Subscription {
    unsubscribe: () => void;
}
