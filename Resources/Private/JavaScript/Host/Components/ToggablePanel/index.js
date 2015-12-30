import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {TransitionMotion, spring} from 'react-motion';
import mergeClassNames from 'classnames';
import Headline from '../Headline/';
import IconButton from '../IconButton/';
import style from './style.css';

const gentle = [120, 14];
const defaultAnimatedStyles = {
    height: spring(0)
};

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

        this.state = {
            isOpened: false,
            isContentHeightMirrorHidden: false,
            contentHeight: 0
        };
    }

    render() {
        const {
            title,
            className,
            children
        } = this.props;
        const {isOpened, isContentHeightMirrorHidden} = this.state;
        const classNames = mergeClassNames({
            [className]: className && className.length,
            [style.panel]: true,
            [style['panel--isOpen']]: isOpened
        });
        const icon = isOpened ? 'chevron-up' : 'chevron-down';
        const contentHeightMirrorStyle = {
            display: isContentHeightMirrorHidden ? 'none' : 'block'
        };

        return (
            <div className={classNames}>
                <Headline className={style.panel__headline} title={title} type="h1" style="h4" />
                <IconButton className={style.panel__toggleBtn} icon={icon} onClick={this.togglePanel.bind(this)} />
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
                              <div key={index} style={inlineStyle} className={style.panel__contents__target}>
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
