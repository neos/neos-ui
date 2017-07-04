import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {$transform, $get} from 'plow-js';
import {connect} from 'react-redux';
import style from './style.css';

@connect($transform({
    isLoading: $get('ui.contentCanvas.isLoading')
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
