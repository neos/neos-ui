import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {$get} from 'plow-js';
import style from './style.css';
import ViewEnvelope from '@neos-project/neos-ui-views/src/ViewEnvelope/index';
import {neos} from '@neos-project/neos-ui-decorators';
import {connect} from 'react-redux';
import {selectors} from '@neos-project/neos-ui-redux-store';
/**
 * (Stateful) View envelope
 *
 * For reference on how to use views, check the docs inside the Registry.
 */
@neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}))
@connect((state, {id}) => {
    return state => ({
        transientValueRaw: $get([id], selectors.UI.Inspector.transientValues(state))
    });
})
export default class InspectorViewEnvelope extends PureComponent {
    static propTypes = {
        transientValueRaw: PropTypes.any,

        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        view: PropTypes.string.isRequired,
        renderSecondaryInspector: PropTypes.func.isRequired,

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
                <ViewEnvelope
                    {...otherProps}
                    highlight={transientValue && transientValue.value !== sourceValue}
                    identifier={id}
                    hooks={transientValue ? transientValue.hooks : null}
                    commit={this.commit}
                    />
            </div>
        );
    }
}
