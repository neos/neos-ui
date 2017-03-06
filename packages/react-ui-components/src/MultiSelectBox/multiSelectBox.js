import React, {PureComponent, PropTypes} from 'react';
import AbstractSelectBox from '../SelectBox/abstractSelectBox';

export default class MultiSelectBox extends AbstractSelectBox {
    static propTypes = {
        /**
         * This prop represents the current selected options.
         */
        selectedOptions: PropTypes.any,

        /**
         * An optional css theme to be injected.
         */
        theme: PropTypes.shape({/* eslint-disable quote-props */
            'selectedOptions': PropTypes.string,
            'selectedOptions__item': PropTypes.string
        }).isRequired, /* eslint-enable quote-props */

        //
        // Static component dependencies which are injected from the outside (index.js)
        // Used in sub-components
        //
        SelectBoxComponent: PropTypes.any.isRequired,
        IconComponent: PropTypes.any.isRequired,
        IconButtonComponent: PropTypes.any.isRequired
    };

    // state = {
    //     options: undefined,
    //     selectedOptions: []
    // };

    constructor(...args) {
        super(...args);

        this.renderSelectedOption = this.renderSelectedOption.bind(this);
        this.addValueToSelectedOptions = this.addValueToSelectedOptions.bind(this);
        this.handleRemoveSelectedOptionsClick = this.handleRemoveSelectedOptionsClick.bind(this);
    }

    componentDidMount() {
        if (this.props.selectedOptions) {
            this.setState({
                selectedOptions: this.props.selectedOptions
            });
        }
    }

    render() {
        const {
            options,
            loadOptionsOnInput,
            placeholder,
            placeholderIcon,
            theme,
            minimumResultsForSearch,
            SelectBoxComponent
        } = this.props;

        const selectedOptions = this.state.selectedOptions;

        return (
            <div className={this.props.theme.wrapper}>
                {Object.prototype.toString.call(selectedOptions) === '[object Array]' ?
                    <ul className={this.props.theme.selectedOptions}>
                        {
                            selectedOptions.map(this.renderSelectedOption)
                        }
                    </ul> : null
                }
                <SelectBoxComponent
                    value={null}
                    options={options}
                    loadOptionsOnInput={loadOptionsOnInput}
                    placeholder={placeholder}
                    placeholderIcon={placeholderIcon}
                    theme={theme}
                    onSelect={this.addValueToSelectedOptions}
                    onDelete={null}
                    clearOnSelect={true}
                    minimumResultsForSearch={minimumResultsForSearch}
                />
            </div>
        );
    }

    addValueToSelectedOptions(value) {
        let currentSelectedOptions = [...this.state.selectedOptions || []];

        const valueAlreadySelected = currentSelectedOptions.find(option => option.value == value);

        // TODO fix this, options in state are empty
        console.log (value, this.state.options, this.props.options);

        if (!valueAlreadySelected) {
            currentSelectedOptions.push({
                icon: this.getOptionIconForValue(value),
                label: this.getOptionLabelForValue(value),
                value: value
            });

            this.setState({
                selectedOptions: currentSelectedOptions
            });

            this.props.onSelect(currentSelectedOptions);
        }

    }

    handleRemoveSelectedOptionsClick(valueToRemove) {
        let currentSelectedOptions = [...this.state.selectedOptions];
        const newSelectedOptions = currentSelectedOptions.filter(option => option.value != valueToRemove);

        this.setState({
            selectedOptions: newSelectedOptions
        });

        this.props.onSelect(currentSelectedOptions);
    }

    select(incomingValue, shouldTriggerOnSelect = true) {
        console.log (incomingValue, shouldTriggerOnSelect)
    }

    /**
     * renders a single option (<li/>) for the list of multi selected values
     *
     * @param {object} option
     * @param {string} option.icon
     * @param {string} option.label
     * @param {number} index
     * @returns {JSX} option element
     */
    renderSelectedOption({icon, label, value}, index) {
        const theme = this.props.theme;
        const IconComponent = this.props.IconComponent;
        const IconButtonComponent = this.props.IconButtonComponent;
        const onClick = () => {
            this.handleRemoveSelectedOptionsClick(value);
        };

        return (
            <li
                key={index}
                className={theme.selectedOptions__item}
            >
                {
                    icon ?
                        <IconComponent className={theme.dropDown__itemIcon} icon={icon}/> :
                        null
                }
                <span>{ label }</span>
                <IconButtonComponent
                    icon={'close'}
                    onClick={onClick}
                />
            </li>
        );
    }
}
