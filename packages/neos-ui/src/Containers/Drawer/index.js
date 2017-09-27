import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';

import {actions} from '@neos-project/neos-ui-redux-store';

import MenuItemGroup from './MenuItemGroup/index';
import style from './style.css';

const TARGET_WINDOW = 'Window';
const TARGET_CONTENT_CANVAS = 'ContentCanvas';
const THRESHOLD_MOUSE_LEAVE = 500;

@connect($transform({
    isHidden: $get('ui.drawer.isHidden')
}), {
    hideDrawer: actions.UI.Drawer.hide,
    setContentCanvasSrc: actions.UI.ContentCanvas.setSrc
})
export default class Drawer extends PureComponent {
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
                        uri: PropTypes.string,
                        target: PropTypes.string,
                        isActive: PropTypes.bool.isReqired,
                        skipI18n: PropTypes.bool.isReqired
                    })
                )
            })
        ).isRequired
    };

    state = {
        mouseLeaveTimeout: null
    };

    handleMouseLeave = () => {
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

    handleMouseEnter = () => {
        const {mouseLeaveTimeout} = this.state;

        if (mouseLeaveTimeout) {
            clearTimeout(mouseLeaveTimeout);
            this.setState({
                mouseLeaveTimeout: null
            });
        }
    }

    handleMenuItemClick = (target, uri) => {
        const {setContentCanvasSrc, hideDrawer} = this.props;

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
    }

    render() {
        const {isHidden, menuData} = this.props;
        const classNames = mergeClassNames({
            [style.drawer]: true,
            [style['drawer--isHidden']]: isHidden
        });

        return (
            <div
                className={classNames}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
                aria-hidden={isHidden ? 'true' : 'false'}
                >
                {Object.values(menuData).map((item, index) => (
                    <MenuItemGroup
                        key={index}
                        onClick={this.handleMenuItemClick}
                        onChildClick={this.handleMenuItemClick}
                        {...item}
                        />
                ))}
            </div>
        );
    }
}
