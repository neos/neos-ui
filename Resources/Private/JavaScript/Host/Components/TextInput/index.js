import React, {Component, PropTypes} from 'react';
import uuid from 'uuid';
import mergeClassNames from 'classnames';
import Label from '../Label/';
import style from './style.css';

export default class TextInput extends Component {
    static propTypes = {
        label: PropTypes.string.isRequired,
        placeholder: PropTypes.string,
        className: PropTypes.string,
        isValid: PropTypes.bool.isRequired,
        onChange: PropTypes.func
    }

    render() {
        const {
            label,
            placeholder,
            className,
            isValid
        } = this.props;
        const classNames = mergeClassNames({
            [className]: className && className.length,
            [style.textInput]: true
        });
        const inputClassNames = mergeClassNames({
            [style.textInput__input]: true,
            [style['textInput--invalid']]: !isValid
        });
        const id = uuid.v1();

        return (
            <div className={classNames}>
                <Label htmlFor={id} label={label} />
                <input
                    className={inputClassNames}
                    id={id}
                    type="text"
                    placeholder={placeholder}
                    onChange={this.onChange.bind(this)}
                    />
            </div>
        );
    }

    onChange(e) {
        const value = e.target.value.substr(0, 140);
        const {onChange} = this.props;

        if (onChange) {
            onChange(value);
        }
    }
}
TextInput.defaultProps = {
    isValid: true
};
