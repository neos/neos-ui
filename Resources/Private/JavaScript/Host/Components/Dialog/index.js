import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import {executeCallback} from '../../Abstracts/';
import Headline from '../Headline/';
import IconButton from '../IconButton/';
import style from './style.css';

export default class Dialog extends Component {
    static propTypes = {
        // State propTypes.
        isOpen: PropTypes.bool.isRequired,

        // Will be called once the close icon in the top right corner gets clicked.
        onRequestClose: PropTypes.func.isRequired,

        // Contents of the Dialog.
        children: PropTypes.node.isRequired,
        title: PropTypes.string.isRequired,

        // Optional Array of nodes(Action buttons f.e.) which are placed at the bottom of the Dialog.
        actions: PropTypes.node,

        // Style related propTypes.
        className: PropTypes.string
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
