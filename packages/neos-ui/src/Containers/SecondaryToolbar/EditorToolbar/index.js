import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$get, $transform} from 'plow-js';

import {neos} from '@neos-project/neos-ui-decorators';
import {selectors} from '@neos-project/neos-ui-redux-store';

import style from './style.css';

// a component is top-level if it does not contain slashes in the name.
const isTopLevelToolbarComponent = componentDefinition =>
    componentDefinition.id.indexOf('/') === -1;

export const hideDisallowedToolbarComponents = (enabledFormattingRuleIds, formattingUnderCursor) => componentDefinition => {
    if (componentDefinition.isVisibleWhen) {
        return componentDefinition.isVisibleWhen(enabledFormattingRuleIds, formattingUnderCursor);
    }

    return enabledFormattingRuleIds.indexOf(componentDefinition.formattingRule) !== -1;
};
/**
 * Render sub components for the toolbar, implementing the API as described in registry.ckEditor.toolbar.
 */
const renderToolbarComponents = (context, toolbarComponents, enabledFormattingRuleIds, formattingUnderCursor) => {
    return toolbarComponents
        .filter(isTopLevelToolbarComponent)
        .filter(hideDisallowedToolbarComponents(enabledFormattingRuleIds, formattingUnderCursor))
        .map((componentDefinition, index) => {
            const {component, formattingRule, callbackPropName, ...props} = componentDefinition;
            const isActive = formattingRule && $get(formattingRule, formattingUnderCursor) === registry.ckEditor.toolbar.TRISTATE_ON;

            props[callbackPropName] = () => {
                // !!!! TODO: next line is extremely dirty!
                context.NeosCKEditorApi.toggleFormat(formattingRule);
            };

            const Component = component;

            return <Component key={index} isActive={isActive} {...props}/>;
        });
};

@connect($transform({
    formattingUnderCursor: selectors.UI.ContentCanvas.formattingUnderCursor,
    enabledFormattingRuleIds: selectors.UI.ContentCanvas.enabledFormattingRuleIds,

    context: selectors.Guest.context
}))
@neos(globalRegistry => {
    toolbarRegistry: globalRegistry.get('richtexttoolbar')
})
export default class Toolbar extends Component {
    static propTypes = {
        formattingUnderCursor: PropTypes.objectOf(React.PropTypes.bool),
        enabledFormattingRuleIds: PropTypes.arrayOf(PropTypes.string),
        toolbarRegistry: PropTypes.object,

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
            this.props.toolbarRegistry.getAllAsList(),
            this.props.enabledFormattingRuleIds,
            this.props.formattingUnderCursor
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
