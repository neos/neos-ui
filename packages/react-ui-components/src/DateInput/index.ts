import {themr} from '@friendsofreactjs/react-css-themr';
import identifiers from '../identifiers';
import style from './style.css';
import DateInput from './dateInput';

const ThemedDateInput = themr(identifiers.dateInput, style)(DateInput);

//
// Dependency injection
//
import injectProps from './../_lib/injectProps';
import Button from './../Button';
import Icon from './../Icon';
import DatePicker from 'react-datetime';
import Collapse from 'react-collapse';

export default injectProps({
    ButtonComponent: Button,
    IconComponent: Icon,
    DatePickerComponent: DatePicker,
    CollapseComponent: Collapse
})(ThemedDateInput);
