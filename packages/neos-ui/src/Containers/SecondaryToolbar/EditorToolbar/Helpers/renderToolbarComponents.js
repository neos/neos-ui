import React from 'react';
import {$get} from 'plow-js';

import hideDisallowedToolbarComponents from './hideDisallowedToolbarComponents';

//
// A component is top-level if it does not contain slashes in the name.
//
const isTopLevelToolbarComponent = componentDefinition =>
    componentDefinition.id.indexOf('/') === -1;

/**
* Render sub components for the toolbar, implementing the API as described in
* the `richtextToolbar` registry.
*/
export default richtextToolbarRegistry => {
    const toolbarComponents = richtextToolbarRegistry.getAllAsList();

    return (onToggleFormat, enabledFormattingRuleIds, formattingUnderCursor) => {
        return toolbarComponents
            .filter(isTopLevelToolbarComponent)
            .filter(hideDisallowedToolbarComponents(enabledFormattingRuleIds, formattingUnderCursor))
            .map((componentDefinition, index) => {
                const {component, formattingRule, callbackPropName, ...props} = componentDefinition;
                const isActive = formattingRule && $get(formattingRule, formattingUnderCursor) === richtextToolbarRegistry.TRISTATE_ON;
                const finalProps = {
                    ...props,
                    formattingRule,
                    [callbackPropName]: () => onToggleFormat(formattingRule)
                };

                const Component = component;

                return <Component key={index} isActive={isActive} {...finalProps}/>;
            });
    };
};
