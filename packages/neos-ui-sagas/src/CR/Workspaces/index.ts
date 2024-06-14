/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import {put, call} from 'redux-saga/effects';

import {actions} from '@neos-project/neos-ui-redux-store';
import {WorkspaceInformation} from '@neos-project/neos-ui-redux-store/src/CR/Workspaces';
import backend from '@neos-project/neos-ui-backend-connector';

export function * updateWorkspaceInfo() {
    const {getWorkspaceInfo} = backend.get().endpoints;
    const workspaceInfo: WorkspaceInformation = yield call(getWorkspaceInfo);
    yield put(actions.CR.Workspaces.update(workspaceInfo));
}
