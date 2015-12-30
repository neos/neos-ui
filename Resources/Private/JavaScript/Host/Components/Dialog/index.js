import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import {executeCallback} from '../../Abstracts/';
import Headline from '../Headline/';
import IconButton from '../IconButton/';
import style from './style.css';

export default class Dialog extends Component {
    static propTypes = {
        actions: PropTypes.node,
        children: PropTypes.node,
        className: PropTypes.string,
        onRequestClose: PropTypes.func.isRequired,
        isOpen: PropTypes.bool.isRequired,
        title: PropTypes.string.isRequired
    }

    render() {
        const {
            className,
            children,
            title
        } = this.props;
        const classNames = mergeClassNames({
            [style.dialog]: true,
            [className]: className && className.length
        });
        const actions = this.props.actions.map((action, index) => <span key={index}>{action}</span>);

        return (
            <section className={classNames} ref="dialog">
                <div className={style.dialog__contents} ref="contentWrapper">
                    <div className={style.dialog__contents__inner}>
                        <Headline type="h1" title={title} />
                        {children}

                        <IconButton
                            icon="close"
                            className={style.dialog__contents__inner__closeBtn}
                            onClick={e => executeCallback(e, this.onCloseClick.bind(this))}
                            />

                        <div className={style.dialog__contents__inner__actions}>
                            {actions}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    onCloseClick() {
        this.props.onRequestClose();
    }
}
