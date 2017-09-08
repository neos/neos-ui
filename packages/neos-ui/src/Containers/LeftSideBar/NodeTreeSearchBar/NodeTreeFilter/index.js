import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import {neos} from '@neos-project/neos-ui-decorators';
import {SelectBox} from '@neos-project/react-ui-components';

import style from './style.css';

@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n'),
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}))
export default class NodeTreeFilter extends PureComponent {

    static propTypes = {
        i18nRegistry: PropTypes.object.isRequired,
        nodeTypesRegistry: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
        value: PropTypes.any
    }

    render() {
        const {i18nRegistry, nodeTypesRegistry, onChange, value} = this.props;
        const label = i18nRegistry.translate('filter', 'Filter', {}, 'Neos.Neos', 'Main');

        const documentNodeTypes = nodeTypesRegistry
            .getSubTypesOf('Neos.Neos:Document')
            .map(nodeTypeName => nodeTypesRegistry.getNodeType(nodeTypeName))
            .filter(i => i);
        const options = documentNodeTypes.map(nodeType => ({
            value: nodeType.name,
            label: i18nRegistry.translate(nodeType.label),
            icon: nodeType.ui.icon
        }));

        return (
            <div className={style.searchBar}>
                <SelectBox
                    placeholder={label}
                    onValueChange={onChange}
                    value={value}
                    options={options}
                    />
            </div>
        );
    }
}
