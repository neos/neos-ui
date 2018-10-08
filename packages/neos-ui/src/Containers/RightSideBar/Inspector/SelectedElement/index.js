import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$get} from 'plow-js';

import Headline from '@neos-project/react-ui-components/src/Headline/';
import Icon from '@neos-project/react-ui-components/src/Icon/';
import SelectBox from '@neos-project/react-ui-components/src/SelectBox/';

import I18n from '@neos-project/neos-ui-i18n';

import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';

import sidebarStyle from '../../style.css';
import style from './style.css';

@neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository'),
    i18nRegistry: globalRegistry.get('i18n')
}))
@connect(state => {
    return {
        focusedNode: selectors.CR.Nodes.focusedSelector(state),
        focusedNodeParentLine: selectors.CR.Nodes.focusedNodeParentLineSelector(state),
        focusedNodeVariants: selectors.CR.Nodes.focusedNodeVariantsSelector(state),
        contentDimensions: $get('cr.contentDimensions.byName', state)
    };
}, {
    focusNode: actions.CR.Nodes.focus,
    selectPreset: actions.CR.ContentDimensions.selectPreset
})
export default class SelectedElement extends PureComponent {
    static propTypes = {
        focusedNode: PropTypes.object.isRequired,
        focusedNodeParentLine: PropTypes.object.isRequired,

        focusNode: PropTypes.func.isRequired,
        nodeTypesRegistry: PropTypes.object.isRequired
    };

    handleSelectNode = selectedNodeContextPath => {
        const {focusNode, focusedNode} = this.props;

        if (selectedNodeContextPath && selectedNodeContextPath !== $get('contextPath', focusedNode)) {
            focusNode(selectedNodeContextPath);
        }
    };

    createNodeOption = node => {
        const {nodeTypesRegistry} = this.props;
        const nodeType = $get('nodeType', node);

        return {
            icon: $get('ui.icon', nodeTypesRegistry.get(nodeType)),
            label: $get('label', node),
            value: $get('contextPath', node)
        };
    }

    nodeVariantsSelector = () => {
        const {focusedNode, focusedNodeVariants, contentDimensions, i18nRegistry} = this.props;
        if (!focusedNodeVariants) {
            return null;
        }

        const currentVariant = {
            value: $get(['dimensions'], focusedNode).toJS(),
            label: (
                <div>
                    {$get('matchesCurrentDimensions', focusedNode) ? (
                        <Icon title="The node dimensions of the selected node match the active dimension configuration, you may edit the node in place freely" icon="check-circle" padded="right" color="primaryBlue" />
                    ) : (
                        <Icon title="The selected node is a shine-through node, you may want to switch to its original dimension to edit it there, editing in-place would create a copy" icon="exclamation-circle" padded="right" color="warn" />
                    )}
                    {contentDimensions.map((dimensionValue, dimensionName) => {
                        const dimensionPresetId = $get(['dimensions', dimensionName], focusedNode);
                        const presetLabel = $get([dimensionName, 'presets', dimensionPresetId, 'label'], contentDimensions);
                        return (<span key={dimensionName} style={{marginRight: 20, fontWeight: 'bold'}}>
                            <Icon title={i18nRegistry.translate($get('label', dimensionValue))} icon={$get('icon', dimensionValue)} padded="right" />
                            <I18n id={presetLabel} />
                        </span>);
                    }).toArray()}
                </div>
            )
        };
        const otherVariants = focusedNodeVariants.map(nodeVariant => {
            return {
                value: nodeVariant.toJS(),
                label: contentDimensions.map((dimensionValue, dimensionName) => {
                    const dimensionPresetId = $get(dimensionName, nodeVariant);
                    const presetLabel = $get([dimensionName, 'presets', dimensionPresetId, 'label'], contentDimensions);
                    return (<span key={dimensionName} style={{marginRight: 20}}>
                        <Icon icon={$get('icon', dimensionValue)} padded="right" />
                        <I18n id={presetLabel} />
                    </span>);
                }).toArray()
            };
        }).toArray();
        const nodeVariantOptions = [currentVariant, ...otherVariants];

        return (
            <div className={style.content}>
                <label title="Switch to the other variants of the selected node" for="#__neos__nodeVariantsSelector" style={{marginBottom: 4, display: 'block'}}>Node variants</label>
                <SelectBox
                    id="__neos__nodeVariantsSelector"
                    options={nodeVariantOptions}
                    value={nodeVariantOptions[0].value}
                    onValueChange={preset => this.props.selectPreset(preset)}
                />
            </div>
        );
    }

    render() {
        const {focusedNode, focusedNodeParentLine} = this.props;

        return (
            <section className={sidebarStyle.rightSideBar__section}>
                <Headline className={style.label}>
                    <Icon icon="mouse-pointer"/>
                    <span>
                        <I18n id="Neos.Neos:Main:content.inspector.inspectorView.selectedElement"/>
                    </span>
                </Headline>
                <div className={style.content}>
                    <SelectBox
                        options={focusedNodeParentLine.map(this.createNodeOption).toJS()}
                        value={$get('contextPath', focusedNode)}
                        onValueChange={this.handleSelectNode}
                        />
                </div>
                {this.nodeVariantsSelector()}
            </section>
        );
    }
}
