import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import IconButton from '@neos-project/react-ui-components/src/IconButton/';

export default class AddNode extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        id: PropTypes.string,
        onClick: PropTypes.func.isRequired,
        focusedNodeContextPath: PropTypes.string,
        isDisabled: PropTypes.bool.isRequired,
        i18nRegistry: PropTypes.object.isRequired
    };

    handleClick = () => {
        const {onClick, focusedNodeContextPath} = this.props;

        onClick(focusedNodeContextPath);
    }

    render() {
        const {focusedNodeContextPath, isDisabled, className, id, i18nRegistry} = this.props;

        return (
            <span>
                <IconButton
                    isDisabled={Boolean(focusedNodeContextPath) === false || isDisabled}
                    className={className}
                    id={id}
                    icon="plus"
                    onClick={this.handleClick}
                    hoverStyle="brand"
                    title={i18nRegistry.translate('createNew')}
                    />
            </span>
        );
    }
}
