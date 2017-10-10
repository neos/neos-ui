import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import Icon from '@neos-project/react-ui-components/src/Icon/';
import ToggablePanel from '@neos-project/react-ui-components/src/ToggablePanel/';
import Button from '@neos-project/react-ui-components/src/Button/';

import I18n from '@neos-project/neos-ui-i18n';

import MenuItem from '../MenuItem/index';
import style from '../style.css';

export default class MenuItemGroup extends PureComponent {
    static propTypes = {
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
        const {label, icon, children, onChildClick} = this.props;

        return (
            <ToggablePanel isOpen={true} style="condensed" className={style.drawer__menuItem}>
                <ToggablePanel.Header className={style.drawer__menuItem__header}>
                    <Button
                        className={style.drawer__menuItemGroupBtn}
                        onClick={this.handleClick}
                        style="transparent"
                        hoverStyle="clean"
                        >
                        {icon && <Icon icon={icon} size="medium" padded="right"/>}

                        <I18n id={label} fallback={label}/>
                    </Button>
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
