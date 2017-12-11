import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import IconButton from '@neos-project/react-ui-components/src/IconButton/';

export default class CopySelectedNode extends PureComponent {
    static propTypes = {
        className: PropTypes.string,

        focusedNodeContextPath: PropTypes.string,

        onClick: PropTypes.func.isRequired,

        isDisabled: PropTypes.bool,

        isActive: PropTypes.bool,

        i18nRegistry: PropTypes.object.isRequired
    };

    handleClick = () => {
        const {focusedNodeContextPath, onClick} = this.props;

        onClick(focusedNodeContextPath);
    }

    render() {
        const {
            className,
            isDisabled,
            isActive,
            i18nRegistry
        } = this.props;

        return (
            <IconButton
                className={className}
                isDisabled={isDisabled}
                isActive={isActive}
                onClick={this.handleClick}
                icon="copy"
                hoverStyle="clean"
                title={i18nRegistry.translate('copy')}
                />
        );
    }
}
