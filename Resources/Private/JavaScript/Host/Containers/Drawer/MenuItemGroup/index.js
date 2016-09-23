import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';

import Icon from '@neos-project/react-ui-components/lib/Icon/';
import ToggablePanel from '@neos-project/react-ui-components/lib/ToggablePanel/';

import {I18n} from 'Host/Containers/index';

import MenuItem from '../MenuItem/index';
import style from '../style.css';

export default class MenuItemGroup extends Component {
    static propTypes = {
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
        ),

        onClick: PropTypes.func.isRequired,
        onChildClick: PropTypes.func.isRequired
    };

    constructor() {
        super();
        this.handleClick = ::this.handleClick;
    }

    shouldComponentUpdate(nextProps) {
        return shallowCompare(this.props, nextProps);
    }

    handleClick() {
        const {uri, target, onClick} = this.props;

        onClick(target, uri);
    }

    render() {
        const {label, icon, children, onChildClick} = this.props;

        return (
            <ToggablePanel isOpen={true} className={style.drawer__menuItem}>
                <ToggablePanel.Header className={style.drawer__menuItem__header}>
                    <span onClick={this.handleClick}>
                        {icon && <Icon icon={icon} padded="right"/>}

                        <I18n id={label} fallback={label}/>
                    </span>
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
