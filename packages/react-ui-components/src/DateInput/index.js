import {themr} from 'react-css-themr';
import identifiers from './../identifiers.js';
import style from './style.css';
import DateInput from './dateInput';

const ThemedDateInput = themr(identifiers.dateInput, style)(DateInput);

//
// Dependency injection
//
import injectProps from './../_lib/injectProps.js';
import Button from './../Button/index';
import Icon from './../Icon/index';
import DatePicker from 'react-datetime';
import Collapse from 'react-collapse';

export default injectProps({
    ButtonComponent: Button,
    IconComponent: Icon,
    DatePickerComponent: DatePicker,
    CollapseComponent: Collapse
})(ThemedDateInput);
