/* eslint-disable camelcase, react/jsx-pascal-case */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import SelectBox_Option_MultiLineWithThumbnail from '@neos-project/react-ui-components/src/SelectBox_Option_MultiLineWithThumbnail';
import {$get} from 'plow-js';
import {neos} from '@neos-project/neos-ui-decorators';

@neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}))
export default class NodeOption extends PureComponent {
    static propTypes = {
        option: PropTypes.shape({
            label: PropTypes.string,
            breadcrumb: PropTypes.string,
            nodeType: PropTypes.string,
            loaderUri: PropTypes.string
        }),

        nodeTypesRegistry: PropTypes.object.isRequired
    };

    render() {
        const {option, nodeTypesRegistry} = this.props;
        const {label, breadcrumb, nodeType} = option;
        const nodeTypeDefinition = nodeTypesRegistry.getNodeType(nodeType);
        const icon = $get('ui.icon', nodeTypeDefinition);
        return (
            <SelectBox_Option_MultiLineWithThumbnail
                {...this.props}
                label={label}
                secondaryLabel={breadcrumb}
                icon={icon}
                />
        );
    }
}
