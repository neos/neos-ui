import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Headline from '@neos-project/react-ui-components/src/Headline/';
import SelectBox from '@neos-project/react-ui-components/src/SelectBox/';

import I18n from '@neos-project/neos-ui-i18n';

import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';

import sidebarStyle from '../../style.module.css';
import style from './style.module.css';

@neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}))
@connect(state => {
    return {
        focusedNode: selectors.CR.Nodes.focusedSelector(state),
        focusedNodeParentLine: selectors.CR.Nodes.focusedNodeParentLineSelector(state)
    };
}, {
    focusNode: actions.CR.Nodes.focus
})
export default class SelectedElement extends PureComponent {
    static propTypes = {
        focusedNode: PropTypes.object.isRequired,
        focusedNodeParentLine: PropTypes.array.isRequired,

        focusNode: PropTypes.func.isRequired,
        nodeTypesRegistry: PropTypes.object.isRequired
    };

    handleSelectNode = selectedNodeContextPath => {
        const {focusNode, focusedNode} = this.props;

        if (selectedNodeContextPath && selectedNodeContextPath !== focusedNode?.contextPath) {
            focusNode(selectedNodeContextPath);
        }
    };

    createNodeOption = node => {
        const {nodeTypesRegistry} = this.props;
        const nodeType = node?.nodeType;

        return {
            icon: nodeTypesRegistry.get(nodeType)?.ui?.icon,
            label: node?.label,
            value: node?.contextPath
        };
    }

    render() {
        const {focusedNode, focusedNodeParentLine} = this.props;

        return (
            <section className={sidebarStyle.rightSideBar__header}>
                <Headline className={style.label}>
                    <span>
                        <I18n id="Neos.Neos:Main:content.inspector.inspectorView.selectedElement"/>
                    </span>
                </Headline>
                <div className={style.content}>
                    <SelectBox
                        options={focusedNodeParentLine.map(this.createNodeOption)}
                        value={focusedNode?.contextPath}
                        onValueChange={this.handleSelectNode}
                        />
                </div>
            </section>
        );
    }
}
