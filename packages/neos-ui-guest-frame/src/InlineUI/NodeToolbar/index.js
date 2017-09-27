import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';
import debounce from 'lodash.debounce';

import {
    findNodeInGuestFrame,
    getAbsolutePositionOfElementInGuestFrame,
    isElementVisibleInGuestFrame,
    animateScrollToElementInGuestFrame
} from '@neos-project/neos-ui-guest-frame/src/dom';

import {
    AddNode,
    CopySelectedNode,
    CutSelectedNode,
    DeleteSelectedNode,
    HideSelectedNode,
    PasteClipBoardNode
} from './Buttons/index';
import style from './style.css';

export default class NodeToolbar extends PureComponent {
    static propTypes = {
        contextPath: PropTypes.string,
        fusionPath: PropTypes.string,
        destructiveOperationsAreDisabled: PropTypes.bool.isRequired,
        // Flag triggered by content tree that tells inlineUI that it should scroll into view
        shouldScrollIntoView: PropTypes.bool.isRequired,
        // Unsets the flag
        requestScrollIntoView: PropTypes.func.isRequired
    };

    state = {
        isSticky: false
    };

    constructor() {
        super();
        this.iframeWindow = document.getElementsByName('neos-content-main')[0].contentWindow;
    }

    updateStickyness = () => {
        const nodeElement = findNodeInGuestFrame(this.props.contextPath, this.props.fusionPath);
        if (nodeElement) {
            const {isSticky} = this.state;
            const {top, bottom} = nodeElement.getBoundingClientRect();
            const shouldBeSticky = top < 50 && bottom > 0;

            if (isSticky !== shouldBeSticky) {
                this.setState({isSticky: shouldBeSticky});
            }
        }
    };

    componentDidMount() {
        this.iframeWindow.addEventListener('resize', debounce(() => this.forceUpdate(), 20));
        this.iframeWindow.addEventListener('scroll', debounce(this.updateStickyness, 5));
    }

    componentDidUpdate() {
        // Only scroll into view when triggered from content tree (on focus change)
        if (this.props.shouldScrollIntoView) {
            this.scrollIntoView();
            this.props.requestScrollIntoView(false);
        }

        this.updateStickyness();
    }

    scrollIntoView() {
        const nodeElement = findNodeInGuestFrame(this.props.contextPath, this.props.fusionPath);

        if (nodeElement && !isElementVisibleInGuestFrame(nodeElement)) {
            animateScrollToElementInGuestFrame(nodeElement, 100);
        }
    }

    render() {
        const {contextPath, fusionPath, destructiveOperationsAreDisabled} = this.props;

        if (!contextPath) {
            return null;
        }

        const props = {
            contextPath,
            fusionPath,
            destructiveOperationsAreDisabled,
            className: style.toolBar__btnGroup__btn
        };

        const nodeElement = findNodeInGuestFrame(contextPath, fusionPath);
        const {top, right} = getAbsolutePositionOfElementInGuestFrame(nodeElement);

        const {isSticky} = this.state;
        const classNames = mergeClassNames({
            [style.toolBar]: true,
            [style['toolBar--isSticky']]: isSticky
        });

        return (
            <div className={classNames} style={{top: top - 50, right}}>
                <div className={style.toolBar__btnGroup}>
                    <AddNode {...props}/>
                    <HideSelectedNode {...props}/>
                    <CopySelectedNode {...props}/>
                    <CutSelectedNode {...props}/>
                    <PasteClipBoardNode {...props}/>
                    <DeleteSelectedNode {...props}/>
                </div>
            </div>
        );
    }
}
