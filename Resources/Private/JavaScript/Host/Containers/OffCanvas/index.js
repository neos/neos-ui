import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import {connect} from 'react-redux';
import {actions} from 'Host/Redux/';
import {
    Button,
    Icon,
    I18n,
    ToggablePanel
} from 'Host/Components/';
import {immutableOperations} from 'Shared/Utilities/';
import style from './style.css';

const {$get} = immutableOperations;

@connect(state => ({
    isHidden: $get(state, 'ui.offCanvas.isHidden')
}), {
    hideOffCanvas: actions.UI.OffCanvas.hide
})
export default class OffCanvas extends Component {
    static propTypes = {
        isHidden: PropTypes.bool.isRequired,
        hideOffCanvas: PropTypes.func.isRequired
    };

    render() {
        const classNames = mergeClassNames({
            [style.offCanvas]: true,
            [style['offCanvas--isHidden']]: this.props.isHidden
        });

        return (
            <div className={classNames} onMouseLeave={() => this.props.hideOffCanvas()} id="neos__offCanvas">
                {this.renderMenu()}
            </div>
        );
    }

    renderMenu() {
        const staticMenuData = [{
            icon: 'file',
            title: 'content_menu_menuPanel_content',
            children: [{
                icon: 'globe',
                title: 'test'
            }]
        }, {
            icon: 'briefcase',
            title: 'management_label',
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
            <ToggablePanel.Wrapper isOpened={true} className={style.offCanvas__menuItem} key={key}>
                <ToggablePanel.Header className={style.offCanvas__menuItem__header}>
                    <Icon icon={icon} padded="right" />
                    <I18n id={title} fallback={title} />
                </ToggablePanel.Header>
                <ToggablePanel.Contents>
                    {children.map((item, index) => this.renderMenuItem(item, index))}
                </ToggablePanel.Contents>
            </ToggablePanel.Wrapper>
        ) : (
            <Button className={style.offCanvas__menuItemBtn} onClick={onClick} key={key}>
                <Icon icon={icon} padded="right" />
                {title}
            </Button>
        );
    }
}
