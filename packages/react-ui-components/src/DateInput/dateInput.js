import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import enhanceWithClickOutside from 'react-click-outside';
import moment from 'moment';

export class DateInput extends PureComponent {
    static propTypes = {
        /**
         * The Date instance which represents the selected value.
         */
        value: PropTypes.instanceOf(Date),

        /**
         * An optional placeholder which will be rendered if no date was selected.
         */
        placeholder: PropTypes.string,

        /**
         * The label which will be displayed within the `Select Today` btn.
         */
        todayLabel: PropTypes.string,

        /**
         * The label which will be displayed within the `Select Today` btn.
         */
        applyLabel: PropTypes.string,

        /**
         * The moment format string to use to format the passed value.
         */
        labelFormat: PropTypes.string,

        /**
         * The changehandler to call when the date changes.
         */
        onChange: PropTypes.func.isRequired,
        theme: PropTypes.shape({/* eslint-disable quote-props */
            'wrapper': PropTypes.string,
            'calendarInputWrapper': PropTypes.string,
            'calendarIconBtn': PropTypes.string,
            'calendarFakeInputWrapper': PropTypes.string,
            'calendarFakeInputMirror': PropTypes.string,
            'calendarFakeInput': PropTypes.string,
            'closeCalendarIconBtn': PropTypes.string,
            'selectTodayBtn': PropTypes.string
        }).isRequired, /* eslint-enable quote-props */

        //
        // Static component dependencies which are injected from the outside (index.js)
        //
        ButtonComponent: PropTypes.any.isRequired,
        IconComponent: PropTypes.any.isRequired,
        DatePickerComponent: PropTypes.any.isRequired,
        CollapseComponent: PropTypes.any.isRequired
    };

    static defaultProps = {
        todayLabel: 'Today',
        applyLabel: 'Apply',
        labelFormat: 'DD-MM-YYYY hh:mm'
    };

    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            transientDate: null
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleApply = this.handleApply.bind(this);
        this.handleClearValueClick = this.handleClearValueClick.bind(this);
        this.handleInputClick = this.open.bind(this);
        this.handleCalendarIconClick = this.open.bind(this);
        this.handleClickOutside = this.close.bind(this);
        this.handleSelectTodayBtnClick = this.handleSelectTodayBtnClick.bind(this);
    }

    render() {
        const {
            ButtonComponent,
            IconComponent,
            DatePickerComponent,
            CollapseComponent,
            placeholder,
            theme,
            value,
            applyLabel,
            todayLabel,
            labelFormat
        } = this.props;
        const selectedDate = value ? moment(value).format(labelFormat) : '';

        return (
            <div className={theme.wrapper}>
                <div className={theme.calendarInputWrapper}>
                    <button
                        onClick={this.handleCalendarIconClick}
                        className={theme.calendarIconBtn}
                        >
                        <IconComponent icon="calendar"/>
                    </button>
                    <div className={theme.calendarFakeInputWrapper}>
                        <div
                            role="presentation"
                            onClick={this.handleInputClick}
                            className={theme.calendarFakeInputMirror}
                            />
                        <input
                            onFocus={this.handleInputClick}
                            type="datetime"
                            placeholder={placeholder}
                            className={theme.calendarFakeInput}
                            value={selectedDate}
                            readOnly
                            />
                    </div>
                    <button
                        onClick={this.handleClearValueClick}
                        className={theme.closeCalendarIconBtn}
                        >
                        <IconComponent icon="remove"/>
                    </button>
                </div>
                <CollapseComponent isOpened={this.state.isOpen}>
                    <button
                        className={theme.selectTodayBtn}
                        onClick={this.handleSelectTodayBtnClick}
                        >
                        {todayLabel}
                    </button>
                    <DatePickerComponent
                        open={true}
                        value={value}
                        onChange={this.handleChange}
                        />
                    <ButtonComponent
                        onClick={this.handleApply}
                        className={theme.applyBtn}
                        style="brand"
                        >
                        {applyLabel}
                    </ButtonComponent>
                </CollapseComponent>
            </div>
        );
    }

    handleChange(momentVal) {
        const date = momentVal.toDate();
        this.setState({
            transientDate: date
        });
    }

    handleApply() {
        this.setState({
            isOpen: false
        }, () => {
            this.props.onChange(this.state.transientDate);
        });
    }

    handleClearValueClick() {
        this.setState({
            isOpen: false
        }, () => {
            this.props.onChange(null);
        });
    }

    handleSelectTodayBtnClick() {
        this.setState({
            isOpen: false
        }, () => {
            this.props.onChange(moment().toDate());
        });
    }

    open() {
        this.setState({
            isOpen: true
        });
    }

    close() {
        this.setState({
            isOpen: false
        });
    }
}

//
// Add the click-outside functionality to the DateInput component.
//
const EnhancedDateInput = enhanceWithClickOutside(DateInput);

export default EnhancedDateInput;
