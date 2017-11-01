import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import ComplexOption from '@neos-project/react-ui-components/src/SelectBox/complexOption';
import {$get} from 'plow-js';
import {neos} from '@neos-project/neos-ui-decorators';

@neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}))
export default class NodeOption extends PureComponent {
    static propTypes = {
        option: PropTypes.shape({
            label: PropTypes.string,
            uriInLiveWorkspace: PropTypes.string,
            nodeType: PropTypes.string,
            loaderUri: PropTypes.string
        }),

        nodeTypesRegistry: PropTypes.object.isRequired
    };

    render() {
        const {option, nodeTypesRegistry} = this.props;
        const {label, uriInLiveWorkspace, nodeType} = option;
        const nodeTypeDefinition = nodeTypesRegistry.getNodeType(nodeType);
        const nodeTypeLabel = $get('ui.label', nodeTypeDefinition);
        const icon = $get('ui.icon', nodeTypeDefinition);
        return (
            <ComplexOption
                {...this.props}
                label={label}
                secondaryLabel={uriInLiveWorkspace}
                tertiaryLabel={nodeTypeLabel}
                icon={icon}
                />
        );
    }
}
