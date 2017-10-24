import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import I18n from '@neos-project/neos-ui-i18n';
import IconButton from '@neos-project/react-ui-components/src/IconButton/';

export default class AddNode extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        onClick: PropTypes.func.isRequired,
        focusedNodeContextPath: PropTypes.string.isRequired
    };

    handleClick = () => {
        const {onClick, focusedNodeContextPath} = this.props;

        onClick(focusedNodeContextPath);
    }

    render() {
        const {focusedNodeContextPath, className} = this.props;
        const tooltipLabel = <I18n id="Neos.Neos:Main:createNew" fallback="Create new"/>;

        return (
            <span>
                <IconButton
                    tooltipLabel={tooltipLabel}
                    tooltipPosition="right"
                    isDisabled={Boolean(focusedNodeContextPath) === false}
                    className={className}
                    icon="plus"
                    onClick={this.handleClick}
                    hoverStyle="clean"
                    />
            </span>
        );
    }
}
