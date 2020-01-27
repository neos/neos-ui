import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import IconButton from '@neos-project/react-ui-components/src/IconButton/';
import style from './style.css';

export default class ToggleContentTree extends PureComponent {
    static propTypes = {
        className: PropTypes.string,

        id: PropTypes.string,

        isPanelOpen: PropTypes.bool.isRequired,

        onClick: PropTypes.func.isRequired,

        i18nRegistry: PropTypes.object.isRequired
    };

    handleClick = () => {
        const {onClick} = this.props;

        onClick();
    }

    render() {
        const {id, isPanelOpen, i18nRegistry} = this.props;

        return (
            <div role="button" className={style.toggle} onClick={this.handleClick}>
                <IconButton
                    id={id}
                    className={style.toggleBtn}
                    icon={isPanelOpen ? 'chevron-circle-down' : 'chevron-circle-up'}
                    hoverStyle="clean"
                    aria-label={i18nRegistry.translate('Neos.Neos:Main:toggleContentTree', 'Toggle content tree')}
                    />
                <span className={style.toggleLabel}>
                    {i18nRegistry.translate('Neos.Neos:Main:contentTree', 'Content Tree')}
                </span>
            </div>
        );
    }
}
