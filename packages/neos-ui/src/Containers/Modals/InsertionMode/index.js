import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';
import {compose} from 'ramda';

import {neos} from '@neos-project/neos-ui-decorators';

import Button from '@neos-project/react-ui-components/lib/Button/';
import Dialog from '@neos-project/react-ui-components/lib/Dialog/';
import Icon from '@neos-project/react-ui-components/lib/Icon/';
import SelectBox from '@neos-project/react-ui-components/lib/SelectBox/';
import I18n from '@neos-project/neos-ui-i18n';

import {selectors, actions} from '@neos-project/neos-ui-redux-store';

import style from './style.css';

@connect($transform({
    isOpen: $get('ui.insertionModeModal.isOpen'),
    subjectContextPath: $get('ui.insertionModeModal.subjectContextPath'),
    referenceContextPath: $get('ui.insertionModeModal.referenceContextPath'),
    enableAlongsideModes: $get('ui.insertionModeModal.enableAlongsideModes'),
    enableIntoMode: $get('ui.insertionModeModal.enableIntoMode'),
    getNodeByContextPath: selectors.CR.Nodes.nodeByContextPath
}), {
    cancel: actions.UI.InsertionModeModal.cancel,
    apply: actions.UI.InsertionModeModal.apply
})

@neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}))
export default class InsertionModeModal extends PureComponent {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        enableAlongsideModes: PropTypes.bool.isRequired,
        enableIntoMode: PropTypes.bool.isRequired,
        cancel: PropTypes.func.isRequired,
        apply: PropTypes.func.isRequired,
        nodeTypesRegistry: PropTypes.object.isRequired
    };

    state = {
        mode: ''
    };

    constructor(...args) {
        super(...args);

        this.handleModeChange = this.handleModeChange.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleApply = this.handleApply.bind(this);

        this.options = [];
    }

    componentWillReceiveProps(props) {
        const {enableAlongsideModes, enableIntoMode} = props;
        this.options = [];

        if (enableAlongsideModes) {
            this.options.push({
                value: 'prepend',
                label: (<span>
                    <I18n fallback="Insert" id="Neos.Neos.Ui:Main:insert"/> <I18n fallback="before" id="before"/> <Icon icon="level-up"/>
                </span>)
            });
        }

        if (enableAlongsideModes) {
            this.options.push({
                value: 'append',
                label: (<span>
                    <I18n fallback="Insert" id="Neos.Neos.Ui:Main:insert"/> <I18n fallback="after" id="after"/> <Icon icon="level-down"/>
                </span>)
            });
        }

        if (enableIntoMode) {
            this.options.push({
                value: 'insert',
                label: (<span>
                    <I18n fallback="Insert" id="Neos.Neos.Ui:Main:insert"/> <I18n fallback="into" id="into"/> <Icon icon="long-arrow-right"/>
                </span>)
            });
        }
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
        const {subjectContextPath, referenceContextPath} = this.props;

        return (
            <div>
                <Icon icon="clipboard"/>
                <span className={style.modalTitle}>
                    <I18n
                        id="Neos.Neos.Ui:Main:copy__from__to--title"
                        params={{
                            source: this.renderNodeLabel(subjectContextPath),
                            target: this.renderNodeLabel(referenceContextPath)
                        }}
                        />
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
            cancel,
            subjectContextPath,
            referenceContextPath
        } = this.props;

        if (!isOpen || !this.options.length) {
            return null;
        }

        return (
            <Dialog
                actions={[this.renderCancel(), this.renderApply()]}
                title={this.renderTitle()}
                onRequestClose={this.handleCancel}
                isOpen
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
                    <SelectBox
                        options={this.options}
                        value={this.state.mode || this.options[0].value}
                        onSelect={this.handleModeChange}
                        />
                </div>
            </Dialog>
        );
    }

    handleModeChange(mode) {
        this.setState({mode});
    }

    handleCancel() {
        const {cancel} = this.props;

        cancel();
    }

    handleApply() {
        const {apply} = this.props;
        const {mode} = this.state;

        apply(mode || this.options[0].value);
    }
}
