import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import mergeClassNames from 'classnames';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';
import Button from '@neos-project/react-ui-components/lib/Button/';
import Icon from '@neos-project/react-ui-components/lib/Icon/';
import ToggablePanel from '@neos-project/react-ui-components/lib/ToggablePanel/';

import {actions} from 'Host/Redux/index';
import {I18n} from 'Host/Containers/index';

import style from './style.css';

const moduleLabel = (label, sourceName = 'Main') =>
    <I18n id={label} sourceName={sourceName} fallback={label}/>;

const TARGET_WINDOW = 'Window';
const TARGET_CONTENT_CANVAS = 'ContentCanvas';
const THRESHOLD_MOUSE_LEAVE = 500;

@connect($transform({
    isHidden: $get('ui.drawer.isHidden')
}), {
    hideDrawer: actions.UI.Drawer.hide,
    setContentCanvasSrc: actions.UI.ContentCanvas.setSrc
})
export default class Drawer extends Component {
    static propTypes = {
        isHidden: PropTypes.bool.isRequired,
        hideDrawer: PropTypes.func.isRequired,
        setContentCanvasSrc: PropTypes.func.isRequired,

        menuData: PropTypes.objectOf(
            PropTypes.shape({
                icon: PropTypes.string,
                label: PropTypes.string.isRequired,
                uri: PropTypes.string.isRequired,
                target: PropTypes.string,

                children: PropTypes.arrayOf(
                    PropTypes.shape({
                        icon: PropTypes.string,
                        label: PropTypes.string.isRequired,
                        uri: PropTypes.string.isRequired,
                        target: PropTypes.string,
                        isActive: PropTypes.bool.isReqired
                    })
                )
            })
        ).isRequired
    };

    state = {
        mouseLeaveTimeout: null
    };

    shouldComponentUpdate(nextProps) {
        return shallowCompare(this.props, nextProps);
    }

    hideDrawer() {
        const {hideDrawer} = this.props;
        const {mouseLeaveTimeout} = this.state;

        if (!mouseLeaveTimeout) {
            const timeout = setTimeout(() => {
                hideDrawer();
                this.setState({
                    mouseLeaveTimeout: null
                });
            }, THRESHOLD_MOUSE_LEAVE);

            this.setState({
                mouseLeaveTimeout: timeout
            });
        }
    }

    clearMouseLeaveTimeout() {
        const {mouseLeaveTimeout} = this.state;

        if (mouseLeaveTimeout) {
            clearTimeout(mouseLeaveTimeout);
            this.setState({
                mouseLeaveTimeout: null
            });
        }
    }

    render() {
        const {isHidden} = this.props;
        const clearMouseLeaveTimeout = ::this.clearMouseLeaveTimeout;
        const hideDrawer = ::this.hideDrawer;
        const classNames = mergeClassNames({
            [style.drawer]: true,
            [style['drawer--isHidden']]: isHidden
        });

        return (
            <div
                className={classNames}
                onMouseEnter={clearMouseLeaveTimeout}
                onMouseLeave={hideDrawer}
                aria-hidden={isHidden ? 'true' : 'false'}
                >
                {this.renderMenu()}
            </div>
        );
    }

    renderMenu() {
        const {menuData} = this.props;

        return Object.keys(menuData).map(k => menuData[k]).map((item, index) => this.renderMenuItem(item, index));
    }

    renderMenuItem(item, key) {
        const {setContentCanvasSrc, hideDrawer} = this.props;
        const {label, icon, children, uri, target} = item;
        const onClick = () => {
            switch (target) {
                case TARGET_CONTENT_CANVAS:
                    setContentCanvasSrc(uri);
                    hideDrawer();
                    break;

                case TARGET_WINDOW:
                default:
                    window.location.href = uri;
                    break;
            }
        };

        return children && children.length ? (
            <ToggablePanel isOpen={true} className={style.drawer__menuItem} key={key}>
                <ToggablePanel.Header className={style.drawer__menuItem__header}>
                    <span onClick={onClick}>
                        {icon && <Icon icon={icon} padded="right"/>}

                        {moduleLabel(label)}
                    </span>
                </ToggablePanel.Header>
                <ToggablePanel.Contents>
                    {children.map((item, index) => this.renderMenuItem(item, index))}
                </ToggablePanel.Contents>
            </ToggablePanel>
        ) : (
            <Button className={style.drawer__menuItemBtn} onClick={onClick} key={key} style="transparent">
				{icon && <Icon icon={icon} padded="right"/>}

                {moduleLabel(label)}
            </Button>
        );
    }
}
