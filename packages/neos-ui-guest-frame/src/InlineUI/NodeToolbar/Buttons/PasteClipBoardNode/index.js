import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {neos} from '@neos-project/neos-ui-decorators';

import IconButton from '@neos-project/react-ui-components/src/IconButton/';

import {selectors, actions} from '@neos-project/neos-ui-redux-store';

@neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository'),
    i18nRegistry: globalRegistry.get('i18n')
}))
@connect((state, {nodeTypesRegistry}) => {
    const canBePastedSelector = selectors.CR.Nodes.makeCanBePastedSelector(nodeTypesRegistry);

    return (state, {contextPath}) => {
        const clipboardNodeContextPath = selectors.CR.Nodes.clipboardNodeContextPathSelector(state);
        const canBePasted = canBePastedSelector(state, {
            subject: clipboardNodeContextPath,
            reference: contextPath
        });

        return {canBePasted};
    };
}, {
    pasteNode: actions.CR.Nodes.paste
})
export default class PasteClipBoardNode extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        canBePasted: PropTypes.bool,

        contextPath: PropTypes.string,
        fusionPath: PropTypes.string,

        pasteNode: PropTypes.func.isRequired,
        i18nRegistry: PropTypes.object.isRequired
    };

    handlePasteButtonClick = () => {
        const {pasteNode, contextPath, fusionPath} = this.props;

        pasteNode(contextPath, fusionPath);
    }

    render() {
        const {className, canBePasted, i18nRegistry} = this.props;

        if (!canBePasted) {
            return null;
        }

        return (
            <IconButton
                className={className}
                onClick={this.handlePasteButtonClick}
                icon="paste"
                tooltipLabel={i18nRegistry.translate('paste')}
                hoverStyle="clean"
                />
        );
    }
}
