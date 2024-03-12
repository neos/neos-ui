import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {neos} from '@neos-project/neos-ui-decorators';

import style from './style.module.css';

@connect(state => ({
    userFirstName: state?.user?.name?.firstName,
    userLastName: state?.user?.name?.lastName
}))
@neos()
export default class UserImage extends PureComponent {
    static propTypes = {
        userFirstName: PropTypes.string.isRequired,
        userLastName: PropTypes.string.isRequired
    };

    render() {
        const userInitials = this.props.userFirstName?.charAt(0) + this.props.userLastName?.charAt(0);
        return (
            <div className={style.user__image}>{userInitials}</div>
        );
    }
}
