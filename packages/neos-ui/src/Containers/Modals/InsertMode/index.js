import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';
import {compose} from 'ramda';

import {neos} from '@neos-project/neos-ui-decorators';

import Button from '@neos-project/react-ui-components/src/NeosButton/';
import Dialog from '@neos-project/react-ui-components/src/Dialog/';
import Icon from '@neos-project/react-ui-components/src/Icon/';
import I18n from '@neos-project/neos-ui-i18n';

import {InsertModeSelector} from '@neos-project/neos-ui-containers';

import {selectors, actions, actionTypes} from '@neos-project/neos-ui-redux-store';

import style from './style.css';

@connect($transform({
    isOpen: $get('ui.insertionModeModal.isOpen'),
    subjectContextPath: $get('ui.insertionModeModal.subjectContextPath'),
    referenceContextPath: $get('ui.insertionModeModal.referenceContextPath'),
    enableAlongsideModes: $get('ui.insertionModeModal.enableAlongsideModes'),
    enableIntoMode: $get('ui.insertionModeModal.enableIntoMode'),
    operationType: $get('ui.insertionModeModal.operationType'),
    getNodeByContextPath: selectors.CR.Nodes.nodeByContextPath
}), {
    cancel: actions.UI.InsertionModeModal.cancel,
    apply: actions.UI.InsertionModeModal.apply
})

@neos(globalRegistry => ({
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
        getNodeByContextPath: PropTypes.func.isRequired,
        subjectContextPath: PropTypes.string,
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

    renderNodeLabel(contextPath) {
        const {getNodeByContextPath, nodeTypesRegistry} = this.props;
        const node = getNodeByContextPath(contextPath);
        const getLabel = $get('label');
        const getNodeType = $get('nodeType');
        const getNodeTypeLabel = compose(getLabel, nodeTypesRegistry.get.bind(nodeTypesRegistry), getNodeType);

        return (
            <span>
                <I18n id={getNodeTypeLabel(node)}/>
                &nbsp;"{getLabel(node)}"
            </span>
        );
    }

    renderTitle() {
        const {subjectContextPath, referenceContextPath, operationType} = this.props;

        return (
            <div>
                <Icon icon="clipboard"/>
                <span className={style.modalTitle}>
                    {operationType === actionTypes.CR.Nodes.COPY &&
                        <I18n
                            key="copy"
                            id="Neos.Neos.Ui:Main:copy__from__to--title"
                            params={{
                                source: this.renderNodeLabel(subjectContextPath),
                                target: this.renderNodeLabel(referenceContextPath)
                            }}
                            />
                    }
                    {operationType === actionTypes.CR.Nodes.CUT &&
                        <I18n
                            key="move"
                            id="Neos.Neos.Ui:Main:move__from__to--title"
                            params={{
                                source: this.renderNodeLabel(subjectContextPath),
                                target: this.renderNodeLabel(referenceContextPath)
                            }}
                            />
                    }
                    {operationType === actionTypes.CR.Nodes.MOVE &&
                        <I18n
                            key="move"
                            id="Neos.Neos.Ui:Main:move__from__to--title"
                            params={{
                                source: this.renderNodeLabel(subjectContextPath),
                                target: this.renderNodeLabel(referenceContextPath)
                            }}
                            />
                    }
                </span>
            </div>
        );
    }

    renderCancel() {
        return (
            <Button
                key="cancel"
                style="lighter"
                hoverStyle="brand"
                variant="darker"
                onClick={this.handleCancel}
                >
                <I18n id="Neos.Neos:Main:cancel" fallback="Cancel"/>
            </Button>
        );
    }

    renderApply() {
        return (
            <Button
                key="apply"
                style="lighter"
                hoverStyle="brand"
                variant="darker"
                onClick={this.handleApply}
                className={style.applyBtn}
                >
                <I18n id="Neos.Neos:Main:apply" fallback="Apply"/>
            </Button>
        );
    }

    render() {
        const {
            isOpen,
            subjectContextPath,
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
                >
                <div className={style.modalContents}>
                    <p>
                        <I18n
                            id="Neos.Neos.Ui:Main:copy__from__to--description"
                            params={{
                                source: this.renderNodeLabel(subjectContextPath),
                                target: this.renderNodeLabel(referenceContextPath)
                            }}
                            />
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
