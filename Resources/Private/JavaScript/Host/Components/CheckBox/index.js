import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import uuid from 'uuid';
import Label from '../Label/';
import style from './style.css';

export default class CheckBox extends Component {
    static propTypes = {
        // State related propTypes.
        isChecked: PropTypes.bool.isRequired,

        // Style related propTypes.
        className: PropTypes.string,

        // Content related propTypes.
        label: PropTypes.string.isRequired,

        // Interaction related propTypes.
        onChange: PropTypes.func
    }

    render() {
        const {
            isChecked,
            label,
            className
        } = this.props;
        const classNames = mergeClassNames({
            [className]: className && className.length,
            [style.checkbox]: true
        });
        const mirrorClassNames = mergeClassNames({
            [style.checkbox__inputMirror]: true,
            [style['checkbox__inputMirror--active']]: isChecked
        });
        const id = uuid.v1();

        return (
            <Label
                className={style.label}
                htmlFor={id}
                label={label}
                isChildrenInlined={true}
                labelPosition="after"
                >
                    <div className={classNames}>
                    <input
                        id={id}
                        className={style.checkbox__input}
                        type="checkbox" checked={isChecked}
                        onChange={e => this.onChange(e)}
                        />
                    <div className={mirrorClassNames}></div>
                </div>
            </Label>
        );
    }

    onChange() {
        const {onChange} = this.props;

        if (onChange) {
            onChange(!this.props.isChecked);
        }
    }
}
