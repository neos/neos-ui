import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import {neos} from '@neos-project/neos-ui-decorators';
import {SelectBox} from '@neos-project/react-ui-components';

import {searchOptions} from '@neos-project/neos-ui-editors/src/Editors/SelectBox/selectBoxHelpers.js';

import style from './style.module.css';

@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n'),
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}))

export default class NodeTreeFilter extends PureComponent {
    static propTypes = {
        i18nRegistry: PropTypes.object.isRequired,
        nodeTypesRegistry: PropTypes.object.isRequired,
        neos: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
        value: PropTypes.any
    }

    state = {
        filterTerm: ''
    };

    handleFilterTermChange = filterTerm => {
        this.setState({filterTerm});
    }

    render() {
        const {i18nRegistry, nodeTypesRegistry, neos, onChange, value} = this.props;
        const label = i18nRegistry.translate('filter', 'Filter', {}, 'Neos.Neos', 'Main');

        const presets = neos?.configuration?.nodeTree?.presets;
        let options = Object.keys(presets)
            .filter(presetName => (presetName !== 'default'))
            .map(presetName => ({
                value: presets?.[presetName]?.baseNodeType,
                label: presets?.[presetName]?.ui?.label || '[' + presetName + ']',
                icon: presets?.[presetName]?.ui?.icon
            }));

        if (options.length === 0) {
            const documentNodeTypes = nodeTypesRegistry
                .getSubTypesOf(nodeTypesRegistry.getRole('document'))
                .map(nodeTypeName => nodeTypesRegistry.getNodeType(nodeTypeName))
                .filter(i => i);

            options = documentNodeTypes.map(nodeType => ({
                value: nodeType.name,
                label: i18nRegistry.translate(nodeType.label),
                icon: nodeType?.ui?.icon
            }));
        }

        return (
            <div id="neos-NodeTreeFilter" className={style.searchBar}>
                <SelectBox
                    id="neos-NodeTreeFilter-SelectBox"
                    placeholder={label}
                    placeholderIcon={'filter'}
                    onValueChange={onChange}
                    allowEmpty={true}
                    value={value}
                    options={searchOptions(this.state.filterTerm, options)}
                    displaySearchBox={true}
                    searchTerm={this.state.filterTerm}
                    onSearchTermChange={this.handleFilterTermChange}
                    threshold={0}
                    noMatchesFoundLabel={this.props.i18nRegistry.translate('Neos.Neos:Main:noMatchesFound')}
                    searchBoxLeftToTypeLabel={this.props.i18nRegistry.translate('Neos.Neos:Main:searchBoxLeftToType')}
                    />
            </div>
        );
    }
}
