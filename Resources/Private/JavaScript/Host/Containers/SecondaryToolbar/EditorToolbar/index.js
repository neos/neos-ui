import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$get, $transform} from 'plow-js';

import style from './style.css';

import registry from 'Host/Extensibility/Registry/index';

/**
 * Render sub components for the toolbar, implementing the API as described in registry.ckEditor.toolbar.
 */
const renderToolbarComponents = (context, toolbarComponents, activeFormatting) => {
    return toolbarComponents.map((componentDefinition, index) => {
        const {component, formatting, callbackPropName, ...props} = componentDefinition;
        const isActive = $get(formatting, activeFormatting);

        props[callbackPropName] = () => {
            // !!!! TODO: next line is extremely dirty!
            context.NeosCKEditorApi.toggleFormat(formatting);
        };

        const Component = component;

        return <Component key={index} isActive={isActive} {...props}/>;
    });
};

@connect($transform({
    activeFormatting: $get('ui.contentCanvas.activeFormatting'),
    context: $get('guest.context')
}))
export default class Toolbar extends Component {
    static propTypes = {
        activeFormatting: PropTypes.objectOf(React.PropTypes.bool),

        // The current guest frames window object.
        context: PropTypes.object
    };

    shouldComponentUpdate(...args) {
        return shallowCompare(this, ...args);
    }

    render() {
        const classNames = mergeClassNames({
            [style.toolBar]: true
        });

        const renderedToolbarComponents = renderToolbarComponents(
            this.props.context,
            registry.ckEditor.toolbar.getAllAsList(),
            this.props.activeFormatting
        );

        return (
            <div className={classNames}>
                <div className={style.toolBar__btnGroup}>
                    {renderedToolbarComponents}
                </div>
            </div>
        );
    }
}
