import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import I18n from '@neos-project/neos-ui-i18n';
import IconButton from '@neos-project/react-ui-components/src/IconButton/';

export default class PasteClipBoardNode extends PureComponent {
    static propTypes = {
        className: PropTypes.string,

        focusedNodeContextPath: PropTypes.string.isRequired,
        isDisabled: PropTypes.bool.isRequired,

        onClick: PropTypes.func.isRequired
    };

    handleClick = () => {
        const {onClick, focusedNodeContextPath} = this.props;

        onClick(focusedNodeContextPath);
    }

    render() {
        const {
            className,
            isDisabled
        } = this.props;
        const tooltipLabel = <I18n id="Neos.Neos:Main:paste" fallback="Paste"/>;

        return (
            <IconButton
                tooltipLabel={tooltipLabel}
                isDisabled={isDisabled}
                className={className}
                icon="paste"
                onClick={this.handleClick}
                hoverStyle="clean"
                />
        );
    }
}
