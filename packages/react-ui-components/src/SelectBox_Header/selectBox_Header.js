/* eslint-disable camelcase, react/jsx-pascal-case */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

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
        placeholder: PropTypes.string,
        placeholderIcon: PropTypes.string,
        showResetButton: PropTypes.bool.isRequired,
        onReset: PropTypes.func,

        /* ------------------------------
         * Theme & Dependencies
         * ------------------------------ */
        theme: PropTypes.shape({
            selectBoxHeader: PropTypes.string.isRequired,
            selectBoxHeader__icon: PropTypes.string.isRequired,
            selectBoxHeader__label: PropTypes.string.isRequired
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
            IconButton,
            placeholder,
            placeholderIcon
        } = this.props;

        const label = option ? option.label : placeholder;
        const icon = option && option.icon ? option.icon : placeholderIcon;

        const resetButton = () => {
            if (showResetButton) {
                return (
                    <span className={theme.selectBoxHeader__wrapperIconWrapper}>
                        <IconButton className={theme.selectBoxHeader__icon} icon="times" onClick={this.props.onReset}/>
                        <span className={theme.selectBoxHeader__seperator}/>
                    </span>
                );
            }

            return '';
        };

        // TODO: lateron, use <ListPreviewElement> here
        return (
            <div className={theme.selectBoxHeader}>
                {icon && <Icon className={theme.selectBoxHeader__icon} icon={icon}/>}
                {label && <span className={theme.selectBoxHeader__label}>{label}</span>}
                {resetButton()}
            </div>
        );
    }
}
