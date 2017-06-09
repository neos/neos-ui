import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import DropDown from '../DropDown/index';
import Icon from '../Icon/index';

export default class SimpleBox extends PureComponent {
    static propTypes = {
        /**
         * This prop represents the current label to show. Can be a placeholder or the label of the selected value.
         */
        label: PropTypes.string,

        /**
         * This prop represents the current icon to show. Can be empty, or a placeholder or the icon of the selected value
         */
        icon: PropTypes.string,

        /**
         * This prop represents if the results are currently loading or not.
         */
        isLoadingOptions: PropTypes.bool,

        /**
         * This prop represents either a set of options or a function that returns those.
         * Each option must have a value and can have a label and an icon.
         */
        options: PropTypes.oneOfType([
            PropTypes.arrayOf(
                PropTypes.shape({
                    icon: PropTypes.string,
                    value: PropTypes.oneOfType([
                        PropTypes.string,
                        PropTypes.object
                    ]).isRequired,
                    label: PropTypes.oneOfType([
                        PropTypes.string,
                        PropTypes.object
                    ]).isRequired
                })
            ),
            PropTypes.func
        ]),

        /**
         * This prop gets called when an option was selected. It returns the new value.
         */
        onSelect: PropTypes.func.isRequired,

        /**
         * An optional css theme to be injected.
         */
        theme: PropTypes.shape({/* eslint-disable quote-props */
            'dropDown': PropTypes.string,
            'dropDown__btn': PropTypes.string,
            'dropDown__btnIcon': PropTypes.string,
            'dropDown__contents': PropTypes.string,
            'dropDown__item': PropTypes.string,
            'dropDown__itemIcon': PropTypes.string,
            'dropDown__loadingIcon': PropTypes.string
        }).isRequired /* eslint-enable quote-props */
    };

    constructor(...args) {
        super(...args);

        this.renderOption = this.renderOption.bind(this);
    }

    render() {
        const {
            label,
            icon,
            theme,
            isLoadingOptions
        } = this.props;

        return (
            <div className={theme.wrapper}>
                <DropDown className={theme.dropDown}>
                    <DropDown.Header className={theme.dropDown__btn} shouldKeepFocusState={false}>
                        {icon ?
                            <Icon className={theme.dropDown__btnIcon} icon={icon}/> :
                            null
                        }
                        <span>{label}</span>
                        {isLoadingOptions ?
                            <Icon className={theme.dropDown__loadingIcon} spin={true} icon="spinner"/> :
                            null
                        }
                    </DropDown.Header>
                    {this.getOptions() ?
                        <DropDown.Contents className={theme.dropDown__contents}>
                            {Object.prototype.toString.call(this.getOptions()) === '[object Array]' ?
                                this.getOptions()
                                    .map(this.renderOption) : null}
                        </DropDown.Contents> :
                        null
                    }
                </DropDown>
            </div>
        );
    }

    /**
     * returns the options
     * @returns {Array}
     */
    getOptions() {
        return this.props.options;
    }

    /**
     * renders a single option (<li/>) for the select box
     * @param {object} option
     * @param {string} option.icon
     * @param {string} option.label
     * @param {string} option.value
     * @param {number} index
     * @returns {JSX} option element
     */
    renderOption({icon, label, value}, index) {
        const theme = this.props.theme;
        const onClick = () => {
            this.props.onSelect(value, true);
        };

        return (
            <li
                key={index}
                className={theme.dropDown__item}
                onClick={onClick}
                >
                {
                    icon ?
                        <Icon className={theme.dropDown__itemIcon} icon={icon}/> :
                        null
                }
                <span>{ label }</span>
            </li>
        );
    }
}
