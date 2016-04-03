import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$get} from 'plow-js';

import {IconButton} from 'Components/index';
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
