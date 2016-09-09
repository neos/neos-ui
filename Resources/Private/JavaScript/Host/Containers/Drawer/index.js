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

@connect($transform({
    isHidden: $get('ui.drawer.isHidden')
}), {
    hideDrawer: actions.UI.Drawer.hide
})
export default class Drawer extends Component {
    static propTypes = {
        isHidden: PropTypes.bool.isRequired,
        hideDrawer: PropTypes.func.isRequired,
		menuData: PropTypes.objectOf(
			PropTypes.shape({
				icon: PropTypes.string,
				label: PropTypes.string.isRequired,
				children: PropTypes.arrayOf(
					PropTypes.shape({
						icon: PropTypes.string,
						label: PropTypes.string.isRequired,
						uri: PropTypes.string.isRequired,
						isActive: PropTypes.bool.isReqired
					})
				)
			})
		).isRequired
    };

    shouldComponentUpdate(...args) {
        return shallowCompare(this, ...args);
    }

    render() {
        const {isHidden, hideDrawer} = this.props;
        const classNames = mergeClassNames({
            [style.drawer]: true,
            [style['drawer--isHidden']]: isHidden
        });

        return (
            <div
                className={classNames}
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
        const {label, icon, children, uri} = item;
        const onClick = () => window.location.href = uri;

        return children && children.length ? (
            <ToggablePanel isOpen={true} className={style.drawer__menuItem} key={key}>
                <ToggablePanel.Header className={style.drawer__menuItem__header}>
					{icon && <Icon icon={icon} padded="right"/>}

                    {moduleLabel(label)}
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
