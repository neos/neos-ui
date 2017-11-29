import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';

const Fragment = props => props.children;

export default class SelectBox_Header extends PureComponent {
    static propTypes = {
        option: PropTypes.shape({
            icon: PropTypes.string,
            label: PropTypes.string.isRequired
        }),
        showResetButton: PropTypes.bool.isRequired,
        onReset: PropTypes.func,

        theme: PropTypes.shape({
            selectBox__btnIcon: PropTypes.string.isRequired,
            selectBox__deleteIcon: PropTypes.string.isRequired,
            dropDown__itemLabel: PropTypes.string.isRequired
        }).isRequired,

        // dependency injection
        Icon: PropTypes.any.isRequired,
        IconButton: PropTypes.any.isRequired
    }

    render() {
        const {
            option,
            showResetButton,
            theme,
            Icon,
            IconButton
        } = this.props;

        // TODO: lateron, use <ListPreviewElement> here
        return (
            <Fragment>
                {Boolean(option) && option.icon && <Icon className={theme.selectBox__btnIcon} icon={option.icon}/>}
                {Boolean(option) && <span className={theme.dropDown__itemLabel}>{option.label}</span>}
                {Boolean(showResetButton) && <IconButton className={theme.selectBox__deleteIcon} icon="times" onClick={this.props.onReset}/>}
            </Fragment>
        );
    }
}
