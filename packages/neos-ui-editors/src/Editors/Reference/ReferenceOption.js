import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {$get} from 'plow-js';
import {neos} from '@neos-project/neos-ui-decorators';
import ListPreviewElement from '@react-ui-components/ListPreviewElement/index';
import style from './style.css';

@neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}))
export default class ReferenceOption extends PureComponent {
    static propTypes = {
        option: PropTypes.shape({
            label: PropTypes.string,
            uriInLiveWorkspace: PropTypes.string,
            nodeType: PropTypes.string
        }),

        nodeTypesRegistry: PropTypes.object.isRequired
    };

    render() {
        const {option, nodeTypesRegistry} = this.props;
        const {label, uriInLiveWorkspace, nodeType} = option;
        const nodeTypeDefinition = nodeTypesRegistry.getNodeType(nodeType);
        const icon = $get('ui.icon', nodeTypeDefinition);

        return (
            <ListPreviewElement {...this.props} className={style.referenceOption} icon={icon}>
                <span>{label}</span>
                <span className={style.referenceOption__link}>{uriInLiveWorkspace}</span>
            </ListPreviewElement>
        );
    }
}
