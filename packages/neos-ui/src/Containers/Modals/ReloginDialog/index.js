import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$transform} from 'plow-js';

import {neos} from '@neos-project/neos-ui-decorators';
import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import backend from '@neos-project/neos-ui-backend-connector';
import fetchWithErrorHandling from '@neos-project/neos-ui-backend-connector/src/FetchWithErrorHandling/index';

import Button from '@neos-project/react-ui-components/src/Button/';
import Dialog from '@neos-project/react-ui-components/src/Dialog/';
import TextInput from '@neos-project/react-ui-components/src/TextInput/';
import Tooltip from '@neos-project/react-ui-components/src/Tooltip/';
import I18n from '@neos-project/neos-ui-i18n';
import style from './style.css';

const emptyFn = () => {};

@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))
@connect($transform({
    authenticationTimeout: selectors.System.authenticationTimeout
}), {
    reauthenticationSucceeded: actions.System.reauthenticationSucceeded
})
export default class ReloginDialog extends PureComponent {
    static propTypes = {
        i18nRegistry: PropTypes.object.isRequired,
        authenticationTimeout: PropTypes.bool.isRequired,
        reauthenticationSucceeded: PropTypes.func.isRequired
    };

    defaultState = {
        message: false,
        username: '',
        password: '',
        isLoading: false
    };

    constructor(props) {
        super(props);
        this.state = {...this.defaultState};
    }

    handleUsernameChange = username => {
        this.setState({username});
    }

    handlePasswordChange = password => {
        this.setState({password});
    }

    handleTryLogin = () => {
        this.setState({isLoading: true});
        backend.get().endpoints.tryLogin(this.state.username, this.state.password).then(newCsrfToken => {
            if (newCsrfToken) {
                fetchWithErrorHandling.updateCsrfTokenAndWorkThroughQueue(newCsrfToken);
                this.props.reauthenticationSucceeded();

                this.setState(this.defaultState);
            } else {
                this.setState({
                    message: this.props.i18nRegistry.translate('Neos.Neos:Main:wrongCredentials', 'The entered username or password was wrong'),
                    isLoading: false
                });
            }
        });
    };

    render() {
        const {authenticationTimeout, i18nRegistry} = this.props;

        if (!authenticationTimeout) {
            return null;
        }

        return (
            <Dialog
                title={<I18n id="Neos.Neos:Main:login.expired" fallback="Your login has expired. Please log in again."/>}
                onRequestClose={emptyFn}
                contentsClassName={style.dialog}
                isOpen
                >
                <div className={style.modalContents}>
                    <TextInput className={style.inputField} value={this.state.username} placeholder={i18nRegistry.translate('Neos.Neos:Main:username', 'Username')} onChange={this.handleUsernameChange}/>
                    <TextInput className={style.inputField} value={this.state.password} placeholder={i18nRegistry.translate('Neos.Neos:Main:password', 'Password')} onChange={this.handlePasswordChange}/>
                    <Button
                        key="login"
                        style="brand"
                        hoverStyle="brand"
                        onClick={this.handleTryLogin}
                        isDisabled={this.state.isLoading}
                        className={style.loginButton}
                        >
                        {this.state.isLoading ?
                            <I18n id="Neos.Neos:Main:authenticating" fallback="Authenticating"/> :
                            <I18n id="Neos.Neos:Main:login" fallback="Login"/>
                        }

                    </Button>
                    {this.state.message ?
                        <Tooltip>{this.state.message}</Tooltip> : null}

                </div>
            </Dialog>
        );
    }
}
