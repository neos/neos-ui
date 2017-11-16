import React, {Component} from 'react';

const BOLD = 'font-weight: bold;';
const RESET = 'font-weight: normal;';

// ToDo: use lodash's upperFirst fn?
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const findDifferences = (type, oldStatePropsOrContext, newStatePropsOrContext) => {
    if (oldStatePropsOrContext === newStatePropsOrContext) {
        return [];
    }

    if (typeof oldStatePropsOrContext !== 'object' || typeof newStatePropsOrContext !== 'object') {
        return [
            [`%cthis.${type}%c is of type %c${typeof oldStatePropsOrContext}%c, %cnew${capitalizeFirstLetter(type)}%c is of type %c${typeof newStatePropsOrContext}%c.`, BOLD, RESET, BOLD, RESET, BOLD, RESET, BOLD, RESET],
            [`this.${type}:`, oldStatePropsOrContext],
            [`new${capitalizeFirstLetter(type)}:`, newStatePropsOrContext]
        ];
    }

    const keysOld = Object.keys(oldStatePropsOrContext);
    const keysNew = Object.keys(newStatePropsOrContext);

    const newHasOwnProperty = Object.prototype.hasOwnProperty.bind(newStatePropsOrContext);

    const result = [];

    for (let i = 0; i < keysOld.length; i++) {
        const key = keysOld[i];
        if (newHasOwnProperty(key)) {
            const valueOld = oldStatePropsOrContext[key];
            const valueNew = newStatePropsOrContext[key];

            if (valueOld !== valueNew) {
                if (valueOld && valueOld.toJS) {
                    result.push([`%cthis.${type}.${key}%c (Immutable.js):`, BOLD, RESET, valueOld.toJS()]);
                } else {
                    result.push([`%cthis.${type}.${key}%c:`, BOLD, RESET, valueOld]);
                }

                if (valueNew && valueNew.toJS) {
                    result.push([`%cnew${capitalizeFirstLetter(type)}.${key}%c (Immutable.js):`, BOLD, RESET, valueNew.toJS()]);
                } else {
                    result.push([`%cnew${capitalizeFirstLetter(type)}.${key}%c:`, BOLD, RESET, valueNew]);
                }
            }
        } else {
            result.push([`new${capitalizeFirstLetter(type)} does not have the property %c${key}%c defined, but this.${type} has.`, BOLD, RESET]);
        }
    }

    const oldHasOwnProperty = Object.prototype.hasOwnProperty.bind(oldStatePropsOrContext);
    for (let i = 0; i < keysNew.length; i++) {
        const key = keysOld[i];
        if (!oldHasOwnProperty(key)) {
            // the key is NEWLY introduced.
            result.push([`new${capitalizeFirstLetter(type)} introduces %c${key}%c, which is not defined on this.${type}.`, BOLD, RESET]);
        }
    }

    return result;
};

const internalDebug = (TargetReactComponent, oldProps, nextProps, oldState, nextState, oldContext, nextContext) => {
    const differencesInProps = findDifferences('props', oldProps, nextProps);
    const differencesInState = findDifferences('state', oldState, nextState);
    const differencesInContext = findDifferences('context', oldContext, nextContext);

    if (differencesInProps.length || differencesInState.length || differencesInContext.length) {
        // Some changes occured; so let's render them.

        const changeMessageParts = [];
        if (differencesInProps.length) {
            changeMessageParts.push('props changed');
        }

        if (differencesInState.length) {
            changeMessageParts.push('state changed');
        }

        if (differencesInContext.length) {
            changeMessageParts.push('context changed');
        }

        console.group(`%c${TargetReactComponent.constructor.name}: component will re-render because %c${changeMessageParts.join(', ')}%c.`, RESET, BOLD, RESET);
        differencesInProps.forEach(logString => console.log.apply(console, logString));
        differencesInState.forEach(logString => console.log.apply(console, logString));
        differencesInContext.forEach(logString => console.log.apply(console, logString));
        console.groupEnd();
    }
};

const debugReasonForRendering = (TargetReactComponent, key, descriptor) => {
    if (!key && !descriptor) {
        // @debugReasonForRendering applied on classes
        class DebuggableComponent extends Component {
            shouldComponentUpdate(nextProps, nextState, nextContext) {
                internalDebug(TargetReactComponent, this.props, nextProps, this.state, nextState, this.context, nextContext);
                return true;
            }
            render() {
                return <TargetReactComponent {...this.props}/>;
            }
        }
        return DebuggableComponent;
    }
    // @debugReasonForRendering applied on shouldComponentUpdate
    if (key !== 'shouldComponentUpdate') {
        console.warn(`${TargetReactComponent.constructor.name}: The debugger "debugReasonForRendering" should only be applied to shouldComponentUpdate(), but you applied it to %c${key}()`, BOLD);
        return descriptor;
    }

    const originalShouldComponentUpdate = descriptor.value;

    descriptor.value = function (nextProps, nextState, nextContext) {
        internalDebug(TargetReactComponent, this.props, nextProps, this.state, nextState, this.context, nextContext);

        return originalShouldComponentUpdate.apply(this, arguments);
    };

    return descriptor;
};

export default debugReasonForRendering;
