import React, {Component, PropTypes} from 'react';
import uuid from 'uuid';
import mergeClassNames from 'classnames';
import Label from '../Label/';
import style from './style.css';

export default class TextInput extends Component {
    static propTypes = {
        label: PropTypes.string.isRequired,
        placeholder: PropTypes.string,

        // Style related propTypes.
        className: PropTypes.string,

        // State related propTypes.
        isValid: PropTypes.bool.isRequired,

        // Interaction related propTypes.
        onChange: PropTypes.func,
        onFocus: PropTypes.func,
        onBlur: PropTypes.func
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
                    onFocus={this.onFocus.bind(this)}
                    onBlur={this.onBlur.bind(this)}
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

    onFocus() {
        const {onFocus} = this.props;

        if (onFocus) {
            onFocus();
        }
    }

    onBlur() {
        const {onBlur} = this.props;

        if (onBlur) {
            onBlur();
        }
    }
}
TextInput.defaultProps = {
    isValid: true
};
