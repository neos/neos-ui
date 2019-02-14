import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import IconButton from '@neos-project/react-ui-components/src/IconButton/';

export default class DeleteSelectedNode extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        id: PropTypes.string,

        focusedNodeContextPath: PropTypes.string,
        isDisabled: PropTypes.bool.isRequired,

        onClick: PropTypes.func.isRequired,

        i18nRegistry: PropTypes.object.isRequired
    };

    handleClick = () => {
        const {focusedNodeContextPath, onClick} = this.props;

        onClick(focusedNodeContextPath);
    }

    render() {
        const {className, id, isDisabled, i18nRegistry} = this.props;

        return (
            <IconButton
                className={className}
                id={id}
                isDisabled={isDisabled}
                onClick={this.handleClick}
                icon="trash-alt"
                hoverStyle="brand"
                title={i18nRegistry.translate('delete')}
                />
        );
    }
}
