import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import IconButton from '@neos-project/react-ui-components/src/IconButton/';

export default class PasteClipBoardNode extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        id: PropTypes.string,

        focusedNodeContextPath: PropTypes.string,
        isDisabled: PropTypes.bool.isRequired,

        onClick: PropTypes.func.isRequired,
        i18nRegistry: PropTypes.object.isRequired
    };

    handleClick = () => {
        const {onClick, focusedNodeContextPath} = this.props;

        onClick(focusedNodeContextPath);
    }

    render() {
        const {
            className,
            id,
            isDisabled,
            i18nRegistry
        } = this.props;

        return (
            <IconButton
                isDisabled={isDisabled}
                className={className}
                id={id}
                icon="paste"
                onClick={this.handleClick}
                hoverStyle="clean"
                title={i18nRegistry.translate('paste')}
                />
        );
    }
}
