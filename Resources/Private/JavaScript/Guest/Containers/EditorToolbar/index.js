import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$get} from 'plow-js';

import {actions} from 'Guest/Redux/index';

import processConfiguration from './ProcessConfiguration/index';
import * as SubComponents from './SubComponents/index';
import style from './style.css';

@connect($get('editorToolbar'), {
    dispatchEditorSignal: actions.EditorToolbar.dispatchSignal
})
export default class Toolbar extends Component {
    static propTypes = {
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        isVisible: PropTypes.bool.isRequired,
        configuration: PropTypes.shape({
            components: PropTypes.arrayOf(
                PropTypes.shape({
                    type: PropTypes.oneOf(Object.keys(SubComponents)),
                    options: PropTypes.object
                })
            ).isRequired
        }),

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
                        const SubComponent = SubComponents[component.type];

                        return (
                            <SubComponent
                                key={index}
                                configuration={component.options}
                                dispatchEditorSignal={dispatchEditorSignal}
                                />
                        );
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
