import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';
import {translate} from '@neos-project/neos-ui-i18n';

import IconButton from '@neos-project/react-ui-components/src/IconButton/';
import style from './style.module.css';

export default class RefreshPageTree extends PureComponent {
    static propTypes = {
        className: PropTypes.string,

        id: PropTypes.string,

        isLoading: PropTypes.bool.isRequired,

        onClick: PropTypes.func.isRequired
    };

    handleClick = () => {
        const {onClick} = this.props;

        onClick();
    }

    render() {
        const {isLoading, className, id} = this.props;
        const finalClassName = mergeClassNames({
            [style.spinning]: isLoading,
            [className]: className && className.length
        });

        return (
            <IconButton
                className={finalClassName}
                id={id}
                disabled={isLoading}
                onClick={this.handleClick}
                icon="sync"
                hoverStyle="brand"
                title={translate('Neos.Neos.Ui:Main:refresh')}
                />
        );
    }
}
