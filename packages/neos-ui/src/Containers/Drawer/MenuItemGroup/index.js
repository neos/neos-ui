import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import Icon from '@neos-project/react-ui-components/src/Icon/';
import ToggablePanel from '@neos-project/react-ui-components/src/ToggablePanel/';
import Button from '@neos-project/react-ui-components/src/Button/';

import I18n from '@neos-project/neos-ui-i18n';

import MenuItem from '../MenuItem/index';
import {TARGET_WINDOW} from '../constants';
import style from '../style.css';

export default class MenuItemGroup extends PureComponent {
    static propTypes = {
        icon: PropTypes.string,
        label: PropTypes.string.isRequired,
        uri: PropTypes.string.isRequired,
        target: PropTypes.string,
        collapsed: PropTypes.bool.isRequired,
        handleMenuGroupToggle: PropTypes.func.isRequired,

        children: PropTypes.arrayOf(
            PropTypes.shape({
                icon: PropTypes.string,
                label: PropTypes.string.isRequired,
                uri: PropTypes.string,
                target: PropTypes.string,
                isActive: PropTypes.bool.isRequired,
                skipI18n: PropTypes.bool
            })
        ),

        onClick: PropTypes.func.isRequired,
        onChildClick: PropTypes.func.isRequired
    };

    handleClick = () => {
        const {uri, target, onClick} = this.props;

        onClick(target, uri);
    }

    render() {
        const {label, icon, children, onChildClick, target, uri, collapsed, handleMenuGroupToggle} = this.props;

        const headerButton = (
            <Button
                className={style.drawer__menuItemGroupBtn}
                onClick={this.handleClick}
                style="transparent"
                hoverStyle="clean"
                >
                {icon && <Icon icon={icon} size="1x" padded="right"/>}

                <I18n id={label} fallback={label}/>
            </Button>
        );

        const header = (target === TARGET_WINDOW ? <a href={uri}>{headerButton}</a> : headerButton);

        return (
            <ToggablePanel onPanelToggle={handleMenuGroupToggle} isOpen={!collapsed} style="condensed" className={style.drawer__menuItem}>
                <ToggablePanel.Header className={style.drawer__menuItem__header}>
                    {header}
                </ToggablePanel.Header>
                <ToggablePanel.Contents>
                    {children.map((item, index) => (
                        <MenuItem key={index} onClick={onChildClick} {...item}/>
                    ))}
                </ToggablePanel.Contents>
            </ToggablePanel>
        );
    }
}
