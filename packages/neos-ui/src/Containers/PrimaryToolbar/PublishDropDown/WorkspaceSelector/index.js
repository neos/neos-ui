import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {$get, $transform} from 'plow-js';
import SelectBox from '@neos-project/react-ui-components/src/SelectBox/';
import {neos} from '@neos-project/neos-ui-decorators';
import style from './style.css';

@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))

export default class WorkspaceSelector extends PureComponent {
    static propTypes = {
        baseWorkspace: PropTypes.string.isRequired,
        allowedWorkspaces: PropTypes.object.isRequired,
        changeBaseWorkspaceAction: PropTypes.func.isRequired,
        changingWorkspaceAllowed: PropTypes.bool,
        i18nRegistry: PropTypes.object.isRequired
    };

    static contextTypes = {
        closeDropDown: PropTypes.func.isRequired
    };

    render() {
        const {allowedWorkspaces, baseWorkspace, changeBaseWorkspaceAction, changingWorkspaceAllowed, i18nRegistry} = this.props;

        const {context} = this;
        const workspacesOptions = Object.keys(allowedWorkspaces).map(i => $transform({label: $get('title'), value: $get('name')}, allowedWorkspaces[i]));
        const onWorkspaceSelect = workspaceName => {
            changeBaseWorkspaceAction(workspaceName);
            context.closeDropDown();
        };
        const anyWorkspacesAvailable = Object.keys(allowedWorkspaces).length > 1;
        const baseWorkspaceTitle = $get([baseWorkspace, 'title'], allowedWorkspaces);

        return (<div>
            {anyWorkspacesAvailable && (changingWorkspaceAllowed ?
                <SelectBox
                    className={style.selectBox}
                    options={workspacesOptions}
                    value={baseWorkspace}
                    onValueChange={onWorkspaceSelect}
                    /> :
                <div className={style.notAllowed} title={i18nRegistry.translate('Neos.Neos:Main:content.components.dirtyWorkspaceDialog.dirtyWorkspaceContainsChanges')}>
                    {baseWorkspaceTitle} – {i18nRegistry.translate('Neos.Neos:Main:content.components.dirtyWorkspaceDialog.dirtyWorkspaceHeader')}
                </div>
            )}
        </div>);
    }
}
