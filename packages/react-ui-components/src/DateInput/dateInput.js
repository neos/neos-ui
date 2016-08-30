import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import enhanceWithClickOutside from 'react-click-outside';
import moment from 'moment';

export class DateInput extends Component {
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
         * The moment format string to use to format the passed value.
         */
        labelFormat: PropTypes.string,

        /**
         * The changehandler to call when the date changes.
         */
        onChange: PropTypes.func.isRequired,
        theme: PropTypes.shape({// eslint-disable-line quote-props
            'wrapper': PropTypes.string,
            'calendarInputWrapper': PropTypes.string,
            'calendarIconBtn': PropTypes.string,
            'calendarFakeInputWrapper': PropTypes.string,
            'calendarFakeInputMirror': PropTypes.string,
            'calendarFakeInput': PropTypes.string,
            'closeCalendarIconBtn': PropTypes.string,
            'selectTodayBtn': PropTypes.string
        }).isRequired,

        //
        // Static component dependencies which are injected from the outside (index.js)
        //
        IconComponent: PropTypes.any.isRequired,
        DatePickerComponent: PropTypes.any.isRequired,
        CollapseComponent: PropTypes.any.isRequired
    };

    static defaultProps = {
        todayLabel: 'Today',
        labelFormat: 'DD-MM-YYYY hh:mm'
    };

    constructor(props) {
        super(props);

        this.state = {
            isOpen: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleClearValueClick = this.handleClearValueClick.bind(this);
        this.handleInputClick = this.open.bind(this);
        this.handleCalendarIconClick = this.open.bind(this);
        this.handleClickOutside = this.close.bind(this);
        this.handleSelectTodayBtnClick = () => this.handleChange(moment());
    }

    shouldComponentUpdate(...args) {
        return shallowCompare(this, ...args);
    }

    render() {
        const {
            IconComponent,
            DatePickerComponent,
            CollapseComponent,
            placeholder,
            theme,
            value,
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
                    <DatePickerComponent
                        open={true}
                        value={value}
                        onChange={this.handleChange}
                        />
                    <button
                        className={theme.selectTodayBtn}
                        onClick={this.handleSelectTodayBtnClick}
                        >
                        {todayLabel}
                    </button>
                </CollapseComponent>
            </div>
        );
    }

    handleChange(momentVal) {
        const date = momentVal.toDate();

        this.setState({
            isOpen: false
        }, () => {
            this.props.onChange(date);
        });
    }

    handleClearValueClick() {
        this.setState({
            isOpen: false
        }, () => {
            this.props.onChange(null);
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
