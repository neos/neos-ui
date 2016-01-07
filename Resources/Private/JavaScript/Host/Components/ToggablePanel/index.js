import React, {Component, PropTypes} from 'react';
import Transition from 'react-motion-ui-pack';
import mergeClassNames from 'classnames';
import Headline from 'Host/Components/Headline/';
import I18n from 'Host/Components/I18n/';
import Icon from 'Host/Components/Icon/';
import IconButton from 'Host/Components/IconButton/';
import style from './style.css';

export default class ToggablePanel extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        isOpened: PropTypes.bool,
        icon: PropTypes.string,
        className: PropTypes.string,
        headerClassName: PropTypes.string,
        children: PropTypes.node.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            isOpened: props.isOpened || false
        };
    }

    render() {
        const {
            className
        } = this.props;
        const classNames = mergeClassNames({
            [className]: className && className.length,
            [style.panel]: true,
            [style['panel--isOpen']]: this.state.isOpened
        });

        return (
            <section className={classNames}>
                {this.renderHeader()}
                {this.renderContents()}
            </section>
        );
    }

    renderHeader() {
        const {
            title,
            icon,
            headerClassName
        } = this.props;
        const toggleIcon = this.state.isOpened ? 'chevron-up' : 'chevron-down';
        const className = mergeClassNames({
            [headerClassName]: headerClassName && headerClassName.length
        });

        return (
            <div className={className}>
                <Headline
                    className={style.panel__headline}
                    type="h1"
                    style="h4"
                    >
                    {icon ? <Icon icon={icon} padded="right" /> : null}
                    <I18n fallback={title} id={title} />
                </Headline>
                <IconButton
                    className={style.panel__toggleBtn}
                    icon={toggleIcon}
                    onClick={this.togglePanel.bind(this)}
                    />
            </div>
        );
    }

    renderContents() {
        return (
            <div>
                <Transition
                    enter={{
                        height: 'auto',
                        opacity: 1
                    }}
                    leave={{
                        height: 0,
                        opacity: 0
                    }}
                    >
                    {this.state.isOpened ? (
                        <div className={style.panel__contents}>
                            <div className={style.panel__contents__target}>
                                {this.props.children}
                            </div>
                        </div>
                    ) : null}
                </Transition>
            </div>
        );
    }

    togglePanel() {
        this.setState({
            isOpened: !this.state.isOpened
        });
    }
}
