import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import {actions} from '@neos-project/neos-ui-redux-store';
import {$transform} from 'plow-js';
import IconButton from '@neos-project/react-ui-components/lib/IconButton/';

import {dom} from '../../../../Helpers/index';

@connect($transform({
}), {
    openAddNodeModal: actions.UI.AddNodeModal.open
})
export default class AddNode extends PureComponent {
    static propTypes = {
        contextPath: PropTypes.string,
        fusionPath: PropTypes.string,
        className: PropTypes.string,
        openAddNodeModal: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.handleOpenModalBtnClick = this.handleOpenModalBtnClick.bind(this);
    }

    render() {
        return (
            <span>
                <IconButton
                    className={this.props.className}
                    icon="plus"
                    onClick={this.handleOpenModalBtnClick}
                    />
            </span>
        );
    }

    handleOpenModalBtnClick() {
        const {
            openAddNodeModal,
            fusionPath,
            contextPath
        } = this.props;
        const closestCollectionElement = dom.closestNode(
            dom.findNode(contextPath, fusionPath)
        );
        const collection = {
            contextPath: closestCollectionElement.getAttribute('data-__neos-node-contextpath'),
            fusionPath: closestCollectionElement.getAttribute('data-__neos-typoscript-path')
        };

        openAddNodeModal({
            subject: {
                contextPath,
                fusionPath
            },
            collection
        }, 'append');
    }
}
