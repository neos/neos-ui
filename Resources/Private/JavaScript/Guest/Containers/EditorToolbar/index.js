import React, {Component, PropTypes} from 'react';
import Measure from 'react-measure';
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

    state = {
        dimensions: {width: 0}
    };

    render() {
        const {x, y, isVisible, configuration, dispatchEditorSignal} = this.props;
        const classNames = mergeClassNames({
            [style.toolBar]: true,
            [style['toolBar--isHidden']]: !isVisible
        });

        return (
            <Measure
                whitelist={['width', 'left']}
                shouldMeasure={mutations => mutations ? mutations[0].target : mutations[0].target}
                onMeasure={dimensions => this.setState({dimensions})}
                >
                <div className={classNames} style={{top: y - 49, left: Math.min(x, window.innerWidth - this.state.dimensions.width - 20) - 9}}>
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
            </Measure>
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
