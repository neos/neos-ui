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

import {AnyError} from '../../types';

export class ErrorBoundary extends React.Component<
    { children: React.ReactNode, errorFallback: React.FC<{ error: AnyError }> },
    { error: any }
> {
    public state = {error: undefined};

    public static getDerivedStateFromError(error: any): {error: any} {
        return {error};
    }

    public render(): React.ReactNode {
        if (this.state.error !== undefined) {
            return React.createElement(this.props.errorFallback, {error: this.state.error})
        }
        return this.props.children;
    }
}
