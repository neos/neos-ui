import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {neos} from '@neos-project/neos-ui-decorators';
import {connect} from 'react-redux';
import {selectors} from '@neos-project/neos-ui-redux-store';
import {$get, $transform} from 'plow-js';

import LinkInput from '@neos-project/neos-ui-editors/src/Library/LinkInput';

@connect(
    $transform({
        focusedNodeType: selectors.CR.Nodes.focusedNodeTypeSelector
    })
)
@neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}))
class LinkEditor extends PureComponent {
    static propTypes = {
        identifier: PropTypes.string.isRequired,
        className: PropTypes.string,
        value: PropTypes.string,
        commit: PropTypes.func.isRequired,
        options: PropTypes.shape({
            nodeTypes: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
            placeholder: PropTypes.string,
            disabled: PropTypes.bool
        }),
        focusedNodeType: PropTypes.string.isRequired,
        nodeTypesRegistry: PropTypes.object.isRequired
    };

    computeLinkOptions = () => {
        const {focusedNodeType, identifier, nodeTypesRegistry, options} = this.props;
        const linkingOptions = $get('linking', nodeTypesRegistry.getInlineEditorOptionsForProperty(focusedNodeType, identifier));

        return Object.assign(options, linkingOptions);
    };

    render() {
        const {value} = this.props;

        return <LinkInput linkValue={value} onLinkChange={this.props.commit} options={this.computeLinkOptions()} />;
    }
}

export default LinkEditor;
