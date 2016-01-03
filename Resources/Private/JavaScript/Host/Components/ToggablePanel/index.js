import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {TransitionMotion, spring} from 'react-motion';
import mergeClassNames from 'classnames';
import Headline from '../Headline/';
import I18n from '../I18n/';
import Icon from '../Icon/';
import IconButton from '../IconButton/';
import style from './style.css';

const gentle = [120, 14];
const defaultAnimatedStyles = {
    height: spring(0)
};

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
            isOpened: props.isOpened || false,
            isContentHeightMirrorHidden: false,
            contentHeight: 0
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
        const {
            children
        } = this.props;
        const {isContentHeightMirrorHidden} = this.state;
        const contentHeightMirrorStyle = {
            display: isContentHeightMirrorHidden ? 'none' : 'block'
        };

        return (
            <div>
                <div ref="contentHeightMirror" style={contentHeightMirrorStyle}>
                    {children}
                </div>

                <TransitionMotion
                    defaultStyles={this.getDefaultValue()}
                    styles={this.getEndValue()}
                    willLeave={this.willLeave}
                    willEnter={this.willEnter}
                    >
                  {styles =>
                      <div className={style.panel__contents}>
                        {Object.keys(styles).map((key, index) => {
                            const {...inlineStyle} = styles[key];
                            return (
                              <div
                                  key={index}
                                  style={inlineStyle}
                                  className={style.panel__contents__target}
                                  >
                                {children}
                              </div>
                          );
                        })}
                    </div>
                  }
                </TransitionMotion>
            </div>
        );
    }

    componentDidMount() {
        this.updateContentHeight();
        this.hideContentHeightMirror();
    }

    togglePanel() {
        this.setState({
            isOpened: !this.state.isOpened
        });
    }

    getDefaultValue() {
        return {
            children: defaultAnimatedStyles
        };
    }

    getEndValue() {
        const {isOpened, contentHeight} = this.state;

        return isOpened ? {
            children: {
                height: spring(contentHeight, gentle)
            }
        } : {};
    }

    willEnter() {
        return defaultAnimatedStyles;
    }

    willLeave() {
        return defaultAnimatedStyles;
    }

    updateContentHeight() {
        const node = ReactDOM.findDOMNode(this.refs.contentHeightMirror);

        this.setState({
            contentHeight: node.clientHeight
        });
    }

    hideContentHeightMirror() {
        this.setState({
            isContentHeightMirrorHidden: true
        });
    }
}
