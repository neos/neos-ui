/* eslint-disable camelcase, react/jsx-pascal-case */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

const Fragment = props => props.children;

/**
 * **SelectBox_Header is an internal implementation detail of SelectBox**, meant to improve code quality.
 *
 * It is used inside SelectBox as the header component which displays the currently selected value.
 */
export default class SelectBox_Header extends PureComponent {
    static propTypes = {
        // API with SelectBox
        option: PropTypes.shape({
            icon: PropTypes.string,
            label: PropTypes.string.isRequired
        }),
        showResetButton: PropTypes.bool.isRequired,
        onReset: PropTypes.func,

        /* ------------------------------
         * Theme & Dependencies
         * ------------------------------ */
        theme: PropTypes.shape({
            selectBoxHeader__icon: PropTypes.string.isRequired,
            selectBoxHeader__label: PropTypes.string.isRequired,
            selectBoxHeader__deleteButton: PropTypes.string.isRequired
        }).isRequired,
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
                {Boolean(option) && option.icon && <Icon className={theme.selectBoxHeader__icon} icon={option.icon}/>}
                {Boolean(option) && <span className={theme.selectBoxHeader__label}>{option.label}</span>}
                {Boolean(showResetButton) && <IconButton className={theme.selectBoxHeader__deleteButton} icon="times" onClick={this.props.onReset}/>}
            </Fragment>
        );
    }
}
