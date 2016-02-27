import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import {connect} from 'react-redux';
import {actions} from 'Host/Redux/';
import {
    Button,
    Icon,
    ToggablePanel
} from 'Host/Components/';
import {immutableOperations} from 'Shared/Utilities/';
import style from './style.css';

const {$get} = immutableOperations;

@connect(state => ({
    isHidden: $get(state, 'ui.offCanvas.isHidden')
}))
export default class OffCanvas extends Component {
    static propTypes = {
        isHidden: PropTypes.bool.isRequired,
        dispatch: PropTypes.any.isRequired
    };

    render() {
        const classNames = mergeClassNames({
            [style.offCanvas]: true,
            [style['offCanvas--isHidden']]: this.props.isHidden
        });

        return (
            <div className={classNames} onMouseLeave={this.hideOffCanvas.bind(this)} id="neos__offCanvas">
                {this.renderMenu()}
            </div>
        );
    }

    renderMenu() {
        const staticMenuData = [{
            icon: 'file',
            title: 'Content',
            children: [{
                icon: 'globe',
                title: 'test'
            }]
        }, {
            icon: 'briefcase',
            title: 'Management',
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
            <ToggablePanel
                isOpened={true}
                title={title}
                icon={icon}
                key={key}
                className={style.offCanvas__menuItem}
                headerClassName={style.offCanvas__menuItem__header}
                >
                {children.map((item, index) => this.renderMenuItem(item, index))}
            </ToggablePanel>
        ) : (
            <Button className={style.offCanvas__menuItemBtn} onClick={onClick} key={key}>
                <Icon icon={icon} padded="right" />
                {title}
            </Button>
        );
    }

    hideOffCanvas() {
        this.props.dispatch(actions.UI.OffCanvas.hide());
    }
}
