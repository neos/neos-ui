import React, {PureComponent, PropTypes} from 'react';

export default class SimpleBox extends PureComponent {
    static propTypes = {
        label: PropTypes.string,
        icon: PropTypes.string,
        isLoadingOptions: PropTypes.bool,

        /**
         * This prop represents either a set of options or a function that returns those.
         * Each option must have a value and can have a label and an icon.
         */
        options: React.PropTypes.oneOfType([
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
        }).isRequired, /* eslint-enable quote-props */

        //
        // Static component dependencies which are injected from the outside (index.js)
        //
        DropDownComponent: PropTypes.any.isRequired,
        IconComponent: PropTypes.any.isRequired,
    };

    constructor(...args) {
        super(...args);

        this.renderOption = this.renderOption.bind(this);
    }

    render() {
        const {
            DropDownComponent,
            IconComponent,
            label,
            icon,
            theme,
            isLoadingOptions
        } = this.props;

        return (
            <div className={theme.wrapper}>
                <DropDownComponent className={theme.dropDown}>
                    <DropDownComponent.Header className={theme.dropDown__btn} shouldKeepFocusState={false}>
                        {icon ?
                            <IconComponent className={theme.dropDown__btnIcon} icon={icon}/> :
                            null
                        }
                        {isLoadingOptions ?
                            <span>Loading ...</span> :
                            <span>{label}</span>

                        }
                        {isLoadingOptions ?
                            <IconComponent className={theme.dropDown__loadingIcon} icon="spinner"/> :
                            null
                        }
                    </DropDownComponent.Header>
                    {this.getOptions() ?
                        <DropDownComponent.Contents className={theme.dropDown__contents}>
                            {Object.prototype.toString.call(this.getOptions()) === '[object Array]' ?
                                this.getOptions()
                                    .map(this.renderOption) : null}
                        </DropDownComponent.Contents> :
                        null
                    }
                </DropDownComponent>
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
        const IconComponent = this.props.IconComponent;
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
                        <IconComponent className={theme.dropDown__itemIcon} icon={icon}/> :
                        null
                }
                <span>{ label }</span>
            </li>
        );
    }
}
