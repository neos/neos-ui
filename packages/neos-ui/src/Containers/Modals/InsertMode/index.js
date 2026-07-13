import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {neos} from '@neos-project/neos-ui-decorators';

import {Button, Dialog, Icon} from '@neos-project/react-ui-components';
import {translate} from '@neos-project/neos-ui-i18n';

import {InsertModeSelector} from '@neos-project/neos-ui-containers';

import {selectors, actions, actionTypes} from '@neos-project/neos-ui-redux-store';

import style from './style.module.css';

@connect(state => ({
    isOpen: state?.ui?.insertionModeModal?.isOpen,
    subjectContextPaths: state?.ui?.insertionModeModal?.subjectContextPaths,
    referenceContextPath: state?.ui?.insertionModeModal?.referenceContextPath,
    enableAlongsideModes: state?.ui?.insertionModeModal?.enableAlongsideModes,
    enableIntoMode: state?.ui?.insertionModeModal?.enableIntoMode,
    operationType: state?.ui?.insertionModeModal?.operationType,
    getNodeByContextPath: selectors.CR.Nodes.nodeByContextPath(state)
}), {
    cancel: actions.UI.InsertionModeModal.cancel,
    apply: actions.UI.InsertionModeModal.apply
})

@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n'),
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}))

export default class InsertModeModal extends PureComponent {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        enableAlongsideModes: PropTypes.bool.isRequired,
        enableIntoMode: PropTypes.bool.isRequired,
        operationType: PropTypes.string,
        cancel: PropTypes.func.isRequired,
        apply: PropTypes.func.isRequired,
        nodeTypesRegistry: PropTypes.object.isRequired,
        i18nRegistry: PropTypes.object.isRequired,
        getNodeByContextPath: PropTypes.func.isRequired,
        subjectContextPaths: PropTypes.array,
        referenceContextPath: PropTypes.string
    };

    state = {
        mode: ''
    };

    handleModeChange = mode => this.setState({mode});

    handleCancel = () => {
        const {cancel} = this.props;

        cancel();
    }

    handleApply = () => {
        const {apply} = this.props;
        const {mode} = this.state;

        apply(mode);
    }

    renderNodeLabel(contextPaths) {
        const {getNodeByContextPath, nodeTypesRegistry, i18nRegistry} = this.props;
        if (contextPaths.length > 1) {
            return `${contextPaths.length} ${translate('Neos.Neos.Ui:Main:nodes', 'nodes')}`;
        }
        const contextPath = contextPaths[0];
        const node = getNodeByContextPath(contextPath);
        const getLabel = node => node?.label;
        const getNodeType = node => node?.nodeType;
        const getNodeTypeLabel = (...args) => getLabel(nodeTypesRegistry.get.bind(nodeTypesRegistry)(getNodeType(...args)));

        return `${i18nRegistry.translate(getNodeTypeLabel(node))} ${getLabel(node)}`;
    }

    renderTitle() {
        const {subjectContextPaths, referenceContextPath, operationType} = this.props;
        const parameters = {
            source: this.renderNodeLabel(subjectContextPaths),
            target: this.renderNodeLabel([referenceContextPath])
        };

        let label = '';
        if (operationType === actionTypes.CR.Nodes.COPY) {
            label = translate('Neos.Neos.Ui:Main:copy__from__to--title', '', parameters);
        } else if (operationType === actionTypes.CR.Nodes.CUT || operationType === actionTypes.CR.Nodes.MOVE) {
            label = translate('Neos.Neos.Ui:Main:move__from__to--title', '', parameters);
        }
        return (
            <div>
                <Icon icon="clipboard"/>
                <span className={style.modalTitle}>
                    {label}
                </span>
            </div>
        );
    }

    renderCancel() {
        return (
            <Button
                id="neos-InsertModeModal-cancel"
                key="cancel"
                style="lighter"
                hoverStyle="brand"
                onClick={this.handleCancel}
                >
                {translate('Neos.Neos.Ui:Main:cancel', 'Cancel')}
            </Button>
        );
    }

    renderApply() {
        return (
            <Button
                id="neos-InsertModeModal-apply"
                key="apply"
                style="lighter"
                hoverStyle="brand"
                onClick={this.handleApply}
                className={style.applyBtn}
                >
                {translate('Neos.Neos.Ui:Main:apply', 'Apply')}
            </Button>
        );
    }

    render() {
        const {
            isOpen,
            subjectContextPaths,
            referenceContextPath,
            enableAlongsideModes,
            enableIntoMode
        } = this.props;

        if (!isOpen) {
            return null;
        }

        return (
            <Dialog
                actions={[this.renderCancel(), this.renderApply()]}
                title={this.renderTitle()}
                onRequestClose={this.handleCancel}
                isOpen={isOpen}
                id="neos-InsertModeDialog"
                >
                <div className={style.modalContents}>
                    <p>
                        {translate('Neos.Neos.Ui:Main:copy__from__to--description', '', {source: this.renderNodeLabel(subjectContextPaths), target: this.renderNodeLabel([referenceContextPath])})}
                    </p>
                    <InsertModeSelector
                        mode={this.state.mode}
                        onSelect={this.handleModeChange}
                        enableAlongsideModes={enableAlongsideModes}
                        enableIntoMode={enableIntoMode}
                        />
                </div>
            </Dialog>
        );
    }
}
