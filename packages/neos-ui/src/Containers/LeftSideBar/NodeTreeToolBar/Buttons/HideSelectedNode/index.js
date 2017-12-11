import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import IconButton from '@neos-project/react-ui-components/src/IconButton/';

export default class HideSelectedNode extends PureComponent {
    static propTypes = {
        className: PropTypes.string,

        focusedNodeContextPath: PropTypes.string.isRequired,
        isDisabled: PropTypes.bool.isRequired,
        isHidden: PropTypes.bool.isRequired,

        onHide: PropTypes.func.isRequired,
        onShow: PropTypes.func.isRequired,
        i18nRegistry: PropTypes.object.isRequired
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
        const {className, isDisabled, isHidden, i18nRegistry} = this.props;

        return (
            <IconButton
                className={className}
                isActive={isHidden}
                isDisabled={isDisabled}
                onClick={isHidden ? this.handleShow : this.handleHide}
                icon="eye-slash"
                hoverStyle="clean"
                title={i18nRegistry.translate('hideUnhide')}
                />
        );
    }
}
