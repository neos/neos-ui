import React from 'react';
import PropTypes from 'prop-types';

import {Icon} from '@neos-project/react-ui-components';
import {neos} from '@neos-project/neos-ui-decorators';
import {connect} from 'react-redux';
import {actions} from '@neos-project/neos-ui-redux-store';
import I18n from '@neos-project/neos-ui-i18n';
import {$transform, $get} from 'plow-js';

import buttonTheme from './style.css';

@connect(
    $transform({
        originUser: $get('user.impersonate.origin')
    }),
    {
        impersonateRestore: actions.User.Impersonate.restore
    }
)
@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))
export default class RestoreButtonItem extends React.PureComponent {
    static propTypes = {
        originUser: PropTypes.object,
        impersonateRestore: PropTypes.func.isRequired,
        i18nRegistry: PropTypes.object.isRequired
    };

    render() {
        const {originUser, i18nRegistry, impersonateRestore} = this.props;
        const title = i18nRegistry.translate(
            'impersonate.title.restoreUserButton',
            'Switch back to the orginal user account',
            {},
            'Neos.Neos',
            'Main'
        );

        return (originUser ? (
            <li className={buttonTheme.dropDown__item}>
                <button
                    title={title}
                    onClick={
                        () => impersonateRestore()
                    }
                >
                    <Icon
                        icon="random"
                        aria-hidden="true"
                        className={buttonTheme.dropDown__itemIcon}
                    />
                    <I18n
                        id="impersonate.label.restoreUserButton"
                        sourceName="Main"
                        packageKey="Neos.Neos"
                        fallback={`Back to user "${originUser.fullName}"`}
                        params={{0: originUser.fullName}}
                    />
                </button>
            </li>
        ) : null);
    }
}
