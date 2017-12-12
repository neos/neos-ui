import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';

import IconButton from '@neos-project/react-ui-components/src/IconButton/';
import style from './style.css';

export default class RefreshPageTree extends PureComponent {
    static propTypes = {
        className: PropTypes.string,

        isLoading: PropTypes.bool.isRequired,

        onClick: PropTypes.func.isRequired,

        i18nRegistry: PropTypes.object.isRequired
    };

    handleClick = () => {
        const {onClick} = this.props;

        onClick();
    }

    render() {
        const {isLoading, className, i18nRegistry} = this.props;
        const finalClassName = mergeClassNames({
            [style.spinning]: isLoading,
            [className]: className && className.length
        });

        return (
            <IconButton
                className={finalClassName}
                isDisabled={isLoading}
                onClick={this.handleClick}
                icon="refresh"
                hoverStyle="clean"
                title={i18nRegistry.translate('refresh')}
                />
        );
    }
}
