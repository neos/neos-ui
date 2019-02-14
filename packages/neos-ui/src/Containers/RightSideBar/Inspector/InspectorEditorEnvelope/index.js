import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {$get} from 'plow-js';
import style from './style.css';
import EditorEnvelope from '@neos-project/neos-ui-editors/src/EditorEnvelope/index';
import {neos} from '@neos-project/neos-ui-decorators';
import {connect} from 'react-redux';
import {selectors} from '@neos-project/neos-ui-redux-store';
/**
 * (Stateful) Editor envelope
 *
 * For reference on how to use editors, check the docs inside the Registry.
 */
@neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository'),
    validatorRegistry: globalRegistry.get('validators')
}))
@connect((state, {id, nodeTypesRegistry, validatorRegistry}) => {
    const validationErrorsSelector = selectors.UI.Inspector.makeValidationErrorsSelector(nodeTypesRegistry, validatorRegistry);
    return state => ({
        transientValueRaw: $get([id], selectors.UI.Inspector.transientValues(state)),
        validationErrors: $get([id], validationErrorsSelector(state)) || null
    });
})
export default class InspectorEditorEnvelope extends PureComponent {
    static propTypes = {
        transientValueRaw: PropTypes.any,

        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        editor: PropTypes.string.isRequired,
        options: PropTypes.object,
        renderSecondaryInspector: PropTypes.func.isRequired,
        validationErrors: PropTypes.array,
        helpMessage: PropTypes.string,

        node: PropTypes.object.isRequired,
        commit: PropTypes.func.isRequired
    };

    commit = (value, hooks = null) => {
        const {transientValueRaw, id, commit} = this.props;

        if (transientValueRaw === value && hooks === null) {
            // Nothing has changed...
            return commit(id, null, null);
        }

        return commit(id, value, hooks);
    }

    render() {
        const {node, id, transientValueRaw, ...otherProps} = this.props;

        //
        // nodeType needs to be read directly from node
        //
        const sourceValueRaw = id === '_nodeType' ? $get('nodeType', node) : $get(['properties', id], node);
        const sourceValue = sourceValueRaw;
        const transientValue = transientValueRaw;

        return (
            <div className={style.wrap}>
                <EditorEnvelope
                    {...otherProps}
                    highlight={transientValue && transientValue.value !== sourceValue}
                    identifier={id}
                    value={transientValue ? transientValue.value : sourceValue}
                    hooks={transientValue ? transientValue.hooks : null}
                    commit={this.commit}
                    />
            </div>
        );
    }
}
