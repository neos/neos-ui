import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';
import debounce from 'lodash.debounce';

import {
    findNodeInGuestFrame,
    getAbsolutePositionOfElementInGuestFrame,
    isElementVisibleInGuestFrame,
    animateScrollToElementInGuestFrame,
    getGuestFrameWindow
} from '@neos-project/neos-ui-guest-frame/src/dom';

import {neos} from '@neos-project/neos-ui-decorators';
import style from './style.css';

@neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository'),
    i18nRegistry: globalRegistry.get('i18n'),
    guestFrameRegistry: globalRegistry.get('@neos-project/neos-ui-guest-frame')
}))
export default class NodeToolbar extends PureComponent {
    static propTypes = {
        contextPath: PropTypes.string,
        fusionPath: PropTypes.string,
        destructiveOperationsAreDisabled: PropTypes.bool.isRequired,
        // Flag triggered by content tree that tells inlineUI that it should scroll into view
        shouldScrollIntoView: PropTypes.bool.isRequired,
        isCut: PropTypes.bool.isRequired,
        isCopied: PropTypes.bool.isRequired,
        canBeDeleted: PropTypes.bool.isRequired,
        canBeEdited: PropTypes.bool.isRequired,
        visibilityCanBeToggled: PropTypes.bool.isRequired,
        // Unsets the flag
        requestScrollIntoView: PropTypes.func.isRequired,
        i18nRegistry: PropTypes.object.isRequired,
        guestFrameRegistry: PropTypes.object.isRequired
    };

    state = {
        isSticky: false
    };

    iframeWindow = getGuestFrameWindow();

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

    debouncedSticky = debounce(this.updateStickyness, 5);

    debouncedUpdate = debounce(() => this.forceUpdate(), 5);

    componentDidMount() {
        this.iframeWindow.addEventListener('resize', this.debouncedUpdate);
        this.iframeWindow.addEventListener('scroll', this.debouncedSticky);
        this.iframeWindow.addEventListener('load', this.debouncedUpdate);

        this.scrollIntoView();
        this.updateStickyness();
    }

    componentDidUpdate() {
        this.scrollIntoView();
        this.updateStickyness();
    }

    componentWillUnmount() {
        this.iframeWindow.removeEventListener('resize', this.debouncedUpdate);
        this.iframeWindow.removeEventListener('scroll', this.debouncedSticky);
        this.iframeWindow.removeEventListener('load', this.debouncedUpdate);

        if (this.debouncedUpdate && this.debouncedUpdate.cancel) {
            this.debouncedUpdate.cancel();
        }

        if (this.debouncedSticky && this.debouncedSticky.cancel) {
            this.debouncedSticky.cancel();
        }
    }

    scrollIntoView() {
        // Only scroll into view when triggered from content tree (on focus change)
        if (this.props.shouldScrollIntoView) {
            const nodeElement = findNodeInGuestFrame(this.props.contextPath, this.props.fusionPath);
            if (nodeElement && !isElementVisibleInGuestFrame(nodeElement)) {
                animateScrollToElementInGuestFrame(nodeElement, 100);
            }
            this.props.requestScrollIntoView(false);
        }
    }

    render() {
        const {
            contextPath,
            fusionPath,
            destructiveOperationsAreDisabled,
            isCut,
            isCopied,
            canBeDeleted,
            canBeEdited,
            visibilityCanBeToggled,
            i18nRegistry,
            guestFrameRegistry
        } = this.props;

        if (!contextPath) {
            return null;
        }

        const props = {
            i18nRegistry,
            contextPath,
            fusionPath,
            destructiveOperationsAreDisabled,
            canBeDeleted,
            canBeEdited,
            isCopied,
            isCut,
            visibilityCanBeToggled,
            className: style.toolBar__btnGroup__btn
        };

        const nodeElement = findNodeInGuestFrame(contextPath, fusionPath);

        // Check if nodeElement exists before accessing its props
        if (!nodeElement) {
            return null;
        }

        const {top, width, rightAsMeasuredFromRightDocumentBorder} = getAbsolutePositionOfElementInGuestFrame(nodeElement);

        // TODO: hardcoded dimensions
        const TOOLBAR_WIDTH = 200;
        const TOOLBAR_HEIGHT = 50;

        const toolbarPosition = {
            top: top - TOOLBAR_HEIGHT
        };
        if (width < TOOLBAR_WIDTH) {
            toolbarPosition.left = 0;
        } else {
            toolbarPosition.right = rightAsMeasuredFromRightDocumentBorder + 'px';
        }

        const {isSticky} = this.state;
        const classNames = mergeClassNames({
            [style.toolBar]: true,
            [style['toolBar--isSticky']]: isSticky
        });

        const NodeToolbarButtons = guestFrameRegistry.getChildren('NodeToolbar/Buttons');

        // The data attribute data-ignore_click_outside is used to disable the enhanceWithClickOutside
        // handling. For the special case that the outOfBandRender returns an empty rendered content
        // we need to disable the enhanceWithClickOutside handling to prevent hick ups in the event
        // registration after guest frame reload.
        return (
            <div className={classNames} data-ignore_click_outside="true" style={toolbarPosition}>
                <div className={style.toolBar__btnGroup}>
                    {NodeToolbarButtons.map((Item, key) => <Item key={key} {...props} />)}
                </div>
            </div>
        );
    }
}
