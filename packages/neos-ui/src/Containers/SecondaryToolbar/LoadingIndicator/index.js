import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import style from './style.module.css';

@connect(state => ({
    isLoading: state?.ui?.contentCanvas?.isLoading
}))
export default class LoadingIndicator extends PureComponent {
    static propTypes = {
        isLoading: PropTypes.bool.isRequired
    }

    render() {
        if (this.props.isLoading) {
            return (
                <div className={style.loadingIndicator__container}>
                    <div className={style.loadingIndicator}>
                        <div className={style.loadingIndicator__bar}/>
                    </div>
                </div>
            );
        }
        return null;
    }
}
