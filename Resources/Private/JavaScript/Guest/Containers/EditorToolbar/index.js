import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$get} from 'plow-js';

import {IconButton, DropDown, Icon} from 'Components/index';
import {actions} from 'Guest/Redux/index';

import processConfiguration from './ProcessConfiguration/index';
import style from './style.css';

@connect($get('editorToolbar'), {
    dispatchEditorSignal: actions.EditorToolbar.dispatchSignal
})
export default class Toolbar extends Component {
    static propTypes = {
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        isVisible: PropTypes.bool.isRequired,
        configuration: PropTypes.object,

        dispatchEditorSignal: PropTypes.func
    };

    render() {
        const props = {
            className: style.toolBar__btnGroup__btn
        };
        const {x, y, isVisible, configuration, dispatchEditorSignal} = this.props;
        const classNames = mergeClassNames({
            [style.toolBar]: true,
            [style['toolBar--isHidden']]: !isVisible
        });

        return (
            <div className={classNames} style={{top: y - 49, left: x - 9}}>
                <div className={style.toolBar__btnGroup}>
                {configuration && configuration.components.map(
                    (component, index) => {
                        if (component.type === 'Button') {
                            return <IconButton
                                key={index}
                                onClick={() => dispatchEditorSignal(component.options.onClick)}
                                isActive={component.options.isActive}
                                icon={component.options.icon}
                                hoverStyle="brand"
                                />
                        }

                        if (component.type === 'DropDown') {
                            return <DropDown>
                                <DropDown.Header className={style.dropDown__btn}>
                                    {component.options.items.filter(
                                        item => item.isActive
                                    ).map(item =>
                                        [
                                            <Icon icon={item.icon} />,
                                            item.label
                                        ]
                                    )}
                                </DropDown.Header>
                                <DropDown.Contents>
                                    {component.options.items.filter(
                                        item => item.isEnabled
                                    ).map(
                                        item => (
                                            <li>
                                                <button type="button" onClick={() => dispatchEditorSignal(item.onSelect)}>
                                                    <Icon icon={item.icon} />
                                                    {item.label}
                                                </button>
                                            </li>
                                        )
                                    )}
                                </DropDown.Contents>
                            </DropDown>
                        }
                    }
                )}
                </div>
            </div>
        );
    }
}

export const registerToolbar = ({dispatch}, configuration) => {
    const initialConfiguration = processConfiguration(configuration);

    return () => {
        const processedConfiguration = processConfiguration(configuration, initialConfiguration);
        dispatch(actions.EditorToolbar.setConfiguration(processedConfiguration));
    };
};
