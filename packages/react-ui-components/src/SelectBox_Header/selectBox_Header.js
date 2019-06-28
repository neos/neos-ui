/* eslint-disable camelcase, react/jsx-pascal-case */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash.omit';

/**
 * **SelectBox_Header is an internal implementation detail of SelectBox**, meant to improve code quality.
 *
 * It is used inside SelectBox as the header component which displays the currently selected value.
 */
class SelectBox_Header extends PureComponent {
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
        displayLoadingIndicator: PropTypes.bool,
        disabled: PropTypes.bool,

        /* ------------------------------
         * Theme & Dependencies
         * ------------------------------ */
        theme: PropTypes.shape({
            selectBoxHeader: PropTypes.string.isRequired,
            selectBoxHeader__icon: PropTypes.string.isRequired,
            selectBoxHeader__label: PropTypes.string.isRequired
        }).isRequired,
        Icon: PropTypes.any.isRequired,
        IconButton: PropTypes.any.isRequired,
        ListPreviewElement: PropTypes.any.isRequired
    }

    resetButton = () => {
        const {showResetButton} = this.props;
        if (showResetButton) {
            const {IconButton, theme, disabled, onReset} = this.props;
            const onClick = event => disabled ? null : onReset(event);

            return (
                <span>
                    <IconButton className={theme.selectBoxHeader__icon} disabled={disabled} icon="times" onClick={onClick}/>
                    <span className={theme.selectBoxHeader__seperator}/>
                </span>
            );
        }

        return '';
    }

    render() {
        const {
            option,
            theme,
            placeholder,
            placeholderIcon,
            displayLoadingIndicator,
            Icon,
            ListPreviewElement,
            disabled
        } = this.props;

        const label = option ? option.label : placeholder;
        const icon = option && option.icon ? option.icon : placeholderIcon;
        const restProps = omit(this.props, ['showResetButton, IconButton']);

        return (
            <div className={theme.selectBoxHeader}>
                {displayLoadingIndicator ? (
                    <span className={theme.selectBoxHeader__wrapperIconWrapper}>
                        <Icon className={theme.selectBoxHeader__icon} spin={true} icon="spinner"/>
                    </span>
                ) : (
                    <div className={theme.selectBoxHeader__innerPreview}>
                        {option ? <ListPreviewElement
                            {...restProps}
                            label={label}
                            icon={icon}
                            disabled={disabled}
                            /> : (
                                <div className={theme.selectBoxHeader__label}>
                                    {icon &&
                                        <span className={theme.selectBoxHeader__wrapperPlaceholderIconWrapper}>
                                            <Icon className={theme.selectBoxHeader__icon} icon={icon}/>
                                        </span>}
                                    {label}
                                </div>
                            )
                        }
                    </div>
                )}
                {this.resetButton()}
            </div>
        );
    }
}

export default SelectBox_Header;
