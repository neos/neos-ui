import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import Headline from '../Headline/';
import IconButton from '../IconButton/';
import style from './style.css';

export default class ToggablePanel extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        className: PropTypes.string,
        children: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.element
        ]).isRequired
    }

    constructor(props) {
        super(props);

        this.state = {isOpened: false};
    }

    render() {
        const {
            title,
            className,
            children
        } = this.props;
        const {isOpened} = this.state;
        const classNames = mergeClassNames({
            [className]: className && className.length,
            [style.panel]: true,
            [style['panel--isOpen']]: isOpened
        });
        const icon = isOpened ? 'chevron-up' : 'chevron-down';

        return (
            <div className={classNames}>
                <Headline className={style.panel__headline} title={title} type="h1" style="h4" />
                <IconButton className={style.panel__toggleBtn} icon={icon} onClick={this.togglePanel.bind(this)} />

                <div className={style.panel__contents}>
                    {children}
                </div>
            </div>
        );
    }

    togglePanel() {
        this.setState({
            isOpened: !this.state.isOpened
        });
    }
}
