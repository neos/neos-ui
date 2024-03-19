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
import {connect} from 'react-redux';

import {PublishDiscardScope, PublishDiscardMode} from '@neos-project/neos-ui-redux-store/src/CR/Workspaces';

import {ConfirmationDialog} from './ConfirmationDialog';
import {ProcessIndicator} from './ProcessIndicator';
import {ResultDialog} from './ResultDialog';

type PublishDiscardDialogState =
    | { type: 'idle' }
    | {
        type: 'start';
        mode: PublishDiscardMode;
        scope: PublishDiscardScope;
        numberOfChanges: number;
    }
    | {
        type: 'ongoing';
        mode: PublishDiscardMode;
        scope: PublishDiscardScope;
        numberOfChanges: number;
    }
    | {
        type: 'success';
        mode: PublishDiscardMode;
        message: string;
    }
    | {
        type: 'error';
        mode: PublishDiscardMode;
        message: string;
    }

const PublishDiscardDialog: React.FC<{ state: PublishDiscardDialogState }> = (props) => {
    const handleAbort = React.useCallback(() => {
        console.log('@TODO: handleAbort');
    }, []);
    const handleConfirm = React.useCallback(() => {
        console.log('@TODO: handleConfirm');
    }, []);
    const handleAcknowledge = React.useCallback(() => {
        console.log('@TODO: handleAcknowledge');
    }, []);
    const handleRetry = React.useCallback(() => {
        console.log('@TODO: handleRetry');
    }, []);

    switch (props.state.type) {
        default:
        case 'idle':
            return null;

        case 'start':
            return (
                <ConfirmationDialog
                    {...props.state}
                    onAbort={handleAbort}
                    onConfirm={handleConfirm}
                    />
            );

        case 'ongoing':
            return (
                <ProcessIndicator {...props.state} />
            );

        case 'error':
        case 'success':
            return (
                <ResultDialog
                    {...props.state}
                    onAcknowledge={handleAcknowledge}
                    onRetry={handleRetry}
                    />
            );
    }
};

export default connect((): { state: PublishDiscardDialogState } => {
    const state: PublishDiscardDialogState = {
        type: 'idle'
    };

    return {state};
})(PublishDiscardDialog);
