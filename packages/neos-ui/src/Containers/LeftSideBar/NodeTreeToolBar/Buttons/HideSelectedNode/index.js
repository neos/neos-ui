import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import I18n from '@neos-project/neos-ui-i18n';
import IconButton from '@neos-project/react-ui-components/src/IconButton/';

export default class HideSelectedNode extends PureComponent {
    static propTypes = {
        className: PropTypes.string,

        focusedNodeContextPath: PropTypes.string.isRequired,
        isDisabled: PropTypes.bool.isRequired,
        isHidden: PropTypes.bool.isRequired,

        onHide: PropTypes.func.isRequired,
        onShow: PropTypes.func.isRequired
    };

    handleHide = () => {
        const {focusedNodeContextPath, onHide} = this.props;

        onHide(focusedNodeContextPath);
    }

    handleShow = () => {
        const {focusedNodeContextPath, onShow} = this.props;

        onShow(focusedNodeContextPath);
    }

    render() {
        const {className, isDisabled, isHidden} = this.props;
        const tooltipLabel = <I18n id="Neos.Neos:Main:hideUnhide" fallback="Copy"/>;

        return (
            <IconButton
                tooltipLabel={tooltipLabel}
                className={className}
                isActive={isHidden}
                isDisabled={isDisabled}
                onClick={isHidden ? this.handleShow : this.handleHide}
                icon="eye-slash"
                hoverStyle="clean"
                />
        );
    }
}
