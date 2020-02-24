import React, {PureComponent} from 'react';
import enhanceWithClickOutside from '../enhanceWithClickOutside/index';
import moment, {Moment, isMoment} from 'moment';
import mergeClassNames from 'classnames';
// @ts-ignore missing typings - we can not update due to a know issue with firefox (https://github.com/neos/neos-ui/pull/1874)
import Collapse from 'react-collapse';
import DatePicker, {TimeConstraints} from 'react-datetime';

import {PickDefaultProps} from '../../types';
import Button from '../Button';
import Icon from '../Icon';


export interface DateInputProps {
    /**
     * The Date instance which represents the selected value.
     */
    readonly value?: Date;

    /**
     * Additional className to render into the wrapper div
     */
    readonly className?: string;

    /**
     * An optional placeholder which will be rendered if no date was selected.
     */
    readonly placeholder?: string;

    /**
     * An optional id for the input.
     */
    readonly id?: string;

    /**
     * The label which will be displayed within the `Select Today` btn.
     */
    readonly todayLabel: string;

    /**
     * The label which will be displayed within the `Apply` btn.
     */
    readonly applyLabel: string;

    /**
     * The moment format string to use to format the passed value.
     */
    readonly labelFormat?: string;

    /**
     * Display only date picker
     */
    readonly dateOnly?: boolean;

    /**
     * Display only time picker
     */
    readonly timeOnly?: boolean;

    /**
     * Add some constraints to the timepicker.
     * It accepts an object with the format { hours: { min: 9, max: 15, step: 2 }},
     * this example means the hours can't be lower than 9 and higher than 15,
     * and it will change adding or subtracting 2 hours everytime the buttons are clicked.
     * The constraints can be added to the hours, minutes, seconds and milliseconds.
     */
    readonly timeConstraints?: TimeConstraints;

    /**
     * Locale for the date picker (determines time format)
     */
    readonly locale: string;

    /**
     * Disable the DateInput
     */
    readonly disabled?: boolean;

    /**
     * The changehandler to call when the date changes.
     */
    readonly onChange: (date: Date | null) => void;

    /**
     * An optional theme using tremr
     */
    readonly theme?: DateInputTheme;
}

interface DateInputTheme {
    'wrapper': string;
    'disabled': string;
    'disabled-cursor': string;
    'calendarInputWrapper': string;
    'calendarIconBtn': string;
    'calendarFakeInputWrapper': string;
    'calendarFakeInputMirror': string;
    'calendarFakeInput': string;
    'applyBtn': string;
    'closeCalendarIconBtn': string;
    'selectTodayBtn': string;
}

const defaultProps: PickDefaultProps<DateInputProps, 'labelFormat' | 'timeConstraints'> = {
    labelFormat: 'DD-MM-YYYY hh:mm',
    timeConstraints: {
        minutes: {
            min: 0,
            max: 59,
            step: 5
        }
    },
};

interface DateInputState {
    readonly isOpen: boolean;
    readonly transientDate: Date | null; // TODO do we have a breaking change when we use 'undefined' in favor of 'null'?
}

const initialState: DateInputState = {
    isOpen: false,
    transientDate: null
};

export class DateInput extends PureComponent<DateInputProps, DateInputState> {
    public static readonly defaultProps = defaultProps;
    public readonly state = initialState;

    public render(): JSX.Element {
        const {
            placeholder,
            theme,
            value,
            className,
            id,
            todayLabel,
            applyLabel,
            labelFormat,
            dateOnly,
            timeOnly,
            locale,
            disabled
        } = this.props;
        const selectedDate = value ? moment(value).format(labelFormat) : '';

        const wrapper = mergeClassNames(
            theme!.wrapper,
            {
                [theme!.disabled]: disabled,
            },
        );

        const calendarInputWrapper = mergeClassNames(className, theme!.calendarInputWrapper);

        const calendarFakeInputMirror = mergeClassNames(
            theme!.calendarFakeInputMirror,
            {
                [theme!['disabled-cursor']]: disabled,
            },
        );

        const calendarIconBtn = mergeClassNames(
            theme!.calendarIconBtn,
            {
                [theme!['disabled-cursor']]: disabled,
            },
        );

        const closeCalendarIconBtn = mergeClassNames(
            theme!.closeCalendarIconBtn,
            {
                [theme!['disabled-cursor']]: disabled,
            },
        );

        return (
            <div className={wrapper}>
                <div className={calendarInputWrapper}>
                    <button
                        onClick={this.handleClick}
                        className={calendarIconBtn}
                    >
                        <Icon icon="far calendar-alt"/>
                    </button>
                    <div className={theme!.calendarFakeInputWrapper}>
                        <div
                            role="presentation"
                            onClick={this.handleClick}
                            className={calendarFakeInputMirror}
                        />
                        <input
                            id={id}
                            onFocus={this.handleFocus}
                            type="datetime"
                            placeholder={placeholder}
                            className={theme!.calendarFakeInput}
                            value={selectedDate}
                            readOnly={true}
                        />
                    </div>
                    <button
                        onClick={this.handleClearValueClick}
                        className={closeCalendarIconBtn}
                    >
                        <Icon icon="times"/>
                    </button>
                </div>
                <Collapse isOpened={this.state.isOpen}>
                    <button
                        className={theme!.selectTodayBtn}
                        onClick={this.handleSelectTodayBtnClick}
                    >
                        {todayLabel}
                    </button>
                    <DatePicker
                        open={true}
                        defaultValue={value}
                        dateFormat={!timeOnly}
                        utc={dateOnly}
                        locale={locale}
                        timeFormat={!dateOnly}
                        onChange={this.handleChange}
                        timeConstraints={this.props.timeConstraints}
                    />
                    <Button
                        onClick={this.handleApply}
                        className={theme!.applyBtn}
                        style="brand"
                    >
                        {applyLabel}
                    </Button>
                </Collapse>
            </div>
        );
    }

    private readonly handleClick = () => {
        if (!this.props.disabled) {
            this.toggle();
        }
    }

    private readonly handleFocus = () => {
        if (!this.props.disabled) {
            this.open();
        }
    }

    private readonly handleClearValueClick = () => {
        if (!this.props.disabled) {
            this.setState({isOpen: false}, () => {
                this.props.onChange(null);
            });
        }
    }

    private readonly handleApply = () => {
        this.setState({
            isOpen: false
        }, () => {
            this.props.onChange(this.state.transientDate);
        });
    }

    private readonly handleChange = (value: Moment | string) => {
        const momentVal: Moment = isMoment(value) ? value : moment(value);
        this.setState({
            transientDate: momentVal.toDate()
        });
    }

    private readonly handleSelectTodayBtnClick = () => {
        this.setState({
            isOpen: false
        }, () => {
            let date = moment().toDate();
            if (this.props.dateOnly) {
                date = moment().utc().startOf('day').toDate();
            }
            this.props.onChange(date);
        });
    }

    public handleClickOutside = () => this.close();

    private readonly toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    private readonly open = () => {
        this.setState({
            isOpen: true
        });
    }

    private readonly close = () => {
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
