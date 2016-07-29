import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$get, $transform} from 'plow-js';

import style from './style.css';

import registry from 'Host/Extensibility/Registry/index';
import {iframeWindow} from 'Host/Containers/ContentCanvas/index';

/**
 * Render sub components for the toolbar, implementing the API as described in registry.ckEditor.toolbar.
 */
const renderToolbarComponents = (toolbarComponents, activeFormatting) => {
    return toolbarComponents.map(componentDefinition => {
        const {component, formatting, callbackPropName, ...props} = componentDefinition;
        const isActive = $get(formatting, activeFormatting);

        props[callbackPropName] = () => {
            // !!!! TODO: next line is extremely dirty!
            iframeWindow.NeosCKEditorApi.toggleFormat(formatting);
        };

        const Component = component;
        return <Component isActive={isActive} {...props} />;
    });
};

@connect($transform({
    activeFormatting: $get('ui.contentCanvas.activeFormatting')
}))
export default class Toolbar extends Component {
    static propTypes = {
        activeFormatting: PropTypes.objectOf(React.PropTypes.bool)
    };
    render() {
        const classNames = mergeClassNames({
            [style.toolBar]: true
        });

        const renderedToolbarComponents = renderToolbarComponents(registry.ckEditor.toolbar.getAllAsList(), this.props.activeFormatting);

        return (
            <div className={classNames}>
                <div className={style.toolBar__btnGroup}>
                    {renderedToolbarComponents}
                </div>
            </div>
        );
    }
}
