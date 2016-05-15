import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';

import {actions} from 'Host/Redux/index';
import {
    Button,
    Icon,
    I18n,
    ToggablePanel
} from 'Components/index';

import style from './style.css';

const moduleLabel = (label, sourceName = 'Main') =>
    <I18n id={label} sourceName={sourceName} fallback={label} />;

@connect($transform({
    isHidden: $get('ui.drawer.isHidden')
}), {
    hideDrawer: actions.UI.Drawer.hide
})
export default class Drawer extends Component {
    static propTypes = {
        isHidden: PropTypes.bool.isRequired,
        hideDrawer: PropTypes.func.isRequired
    };

    render() {
        const {isHidden} = this.props;
        const classNames = mergeClassNames({
            [style.drawer]: true,
            [style['drawer--isHidden']]: isHidden
        });

        return (
            <div
                className={classNames}
                onMouseLeave={() => this.props.hideDrawer()}
                id="neos__drawer"
                aria-hidden={isHidden ? 'true' : 'false'}
                >
                {this.renderMenu()}
            </div>
        );
    }

    renderMenu() {
        const staticMenuData = [{
            icon: 'file',
            title: moduleLabel('content_menu_menuPanel_content'),
            children: [{
                icon: 'globe',
                title: 'test'
            }]
        }, {
            icon: 'briefcase',
            title: moduleLabel('management_label', 'Modules'),
            children: [{
                icon: 'th-large',
                title: 'Workspaces'
            }, {
                icon: 'camera',
                title: 'Media'
            }, {
                icon: 'calendar',
                title: 'History'
            }]
        }];

        return staticMenuData.map((item, index) => this.renderMenuItem(item, index));
    }

    renderMenuItem(item, key) {
        const {title, icon, children} = item;
        const onClick = () => {
            console.log(`change to menu page "${title}"`);
        };

        return children && children.length ? (
            <ToggablePanel isOpened={true} className={style.drawer__menuItem} key={key}>
                <ToggablePanel.Header className={style.drawer__menuItem__header}>
                    <Icon icon={icon} padded="right" />
                    {title}
                </ToggablePanel.Header>
                <ToggablePanel.Contents>
                    {children.map((item, index) => this.renderMenuItem(item, index))}
                </ToggablePanel.Contents>
            </ToggablePanel>
        ) : (
            <Button className={style.drawer__menuItemBtn} onClick={onClick} key={key}>
                <Icon icon={icon} padded="right" />
                {title}
            </Button>
        );
    }
}
