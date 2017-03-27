import React, {PropTypes} from 'react';
import AbstractSelectBox, {propTypes as abstractSelectBoxPropTypes, state as abstractState} from '../SelectBox/abstractSelectBox';

export default class MultiSelectBox extends AbstractSelectBox {
    static propTypes = {
        ...abstractSelectBoxPropTypes,

        value: PropTypes.arrayOf(
            PropTypes.string
        ),

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

    state = {
        ...abstractState,
        selectedOptions: []
    };

    constructor(...args) {
        super(...args);

        this.renderSelectedOption = this.renderSelectedOption.bind(this);
        this.handleOnSelect = this.handleOnSelect.bind(this);
        this.handleRemoveSelectedOptionsClick = this.handleRemoveSelectedOptionsClick.bind(this);
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
                    onSelect={this.handleOnSelect}
                    onDelete={null}
                    clearOnSelect={true}
                    minimumResultsForSearch={minimumResultsForSearch}
                    />
            </div>
        );
    }

    // adds the newly selected value to the selected options
    handleOnSelect(value) {
        const currentSelectedOptions = [...this.state.selectedOptions || []];

        const valueAlreadySelected = currentSelectedOptions.find(option => option.value === value);

        if (!valueAlreadySelected) {
            currentSelectedOptions.push({
                icon: this.getOptionIconForValue(value),
                label: this.getOptionLabelForValue(value),
                value
            });

            this.setState({
                selectedOptions: currentSelectedOptions
            });

            this.props.onSelect(currentSelectedOptions);
        }
    }

    handleRemoveSelectedOptionsClick(valueToRemove) {
        const currentSelectedOptions = [...this.state.selectedOptions];
        const newSelectedOptions = currentSelectedOptions.filter(option => option.value !== valueToRemove);

        this.setState({
            selectedOptions: newSelectedOptions
        });

        this.props.onSelect(currentSelectedOptions);
    }

    select(incomingValue) {
        const selectedOptions = incomingValue.map(value =>
            ({
                value,
                label: this.getOptionLabelForValue(value),
                icon: this.getOptionIconForValue(value)
            })
        );

        this.setState({
            selectedOptions
        });
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
