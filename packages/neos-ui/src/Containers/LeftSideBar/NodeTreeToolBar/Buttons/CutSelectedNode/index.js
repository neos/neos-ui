import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import IconButton from '@neos-project/react-ui-components/src/IconButton/';

export default class CutSelectedNode extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        id: PropTypes.string,

        focusedNodeContextPath: PropTypes.string,
        isDisabled: PropTypes.bool.isRequired,
        isActive: PropTypes.bool.isRequired,

        onClick: PropTypes.func.isRequired,
        i18nRegistry: PropTypes.object.isRequired
    };

    handleClick = () => {
        const {focusedNodeContextPath, onClick} = this.props;

        onClick(focusedNodeContextPath);
    }

    render() {
        const {className, id, isDisabled, isActive, i18nRegistry} = this.props;

        return (
            <IconButton
                className={className}
                id={id}
                isDisabled={isDisabled}
                isActive={isActive}
                onClick={this.handleClick}
                icon="cut"
                hoverStyle="brand"
                title={i18nRegistry.translate('cut')}
                />
        );
    }
}
