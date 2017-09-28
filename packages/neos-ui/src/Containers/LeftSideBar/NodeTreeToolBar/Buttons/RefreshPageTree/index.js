import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';

import I18n from '@neos-project/neos-ui-i18n';
import IconButton from '@neos-project/react-ui-components/src/IconButton/';
import style from './style.css';

export default class RefreshPageTree extends PureComponent {
    static propTypes = {
        className: PropTypes.string,

        isLoading: PropTypes.bool.isRequired,

        onClick: PropTypes.func.isRequired
    };

    handleClick = () => {
        const {onClick} = this.props;

        onClick();
    }

    render() {
        const {isLoading, className} = this.props;
        const finalClassName = mergeClassNames({
            [style.spinning]: isLoading,
            [className]: className && className.length
        });
        const tooltipLabel = <I18n id="Neos.Neos:Main:refresh" fallback="Refresh"/>;

        return (
            <IconButton
                tooltipLabel={tooltipLabel}
                className={finalClassName}
                isDisabled={isLoading}
                onClick={this.handleClick}
                icon="refresh"
                hoverStyle="clean"
                />
        );
    }
}
