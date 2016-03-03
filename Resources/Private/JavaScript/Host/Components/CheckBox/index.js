import React, {PropTypes} from 'react';
import mergeClassNames from 'classnames';
import uuid from 'uuid';
import Label from 'Host/Components/Label/';
import style from './style.css';

const onChangeHandler = (cb, isChecked) => {
    if (cb) {
        cb(isChecked);
    }
};

const CheckBox = props => {
    const {
        isChecked,
        label,
        className,
        onChange,
        ...directProps
    } = props;
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
                    type="checkbox"
                    role="checkbox"
                    checked={isChecked}
                    aria-checked={isChecked}
                    onChange={() => onChange(onChangeHandler, !isChecked)}
                    {...directProps}
                    />
                <div className={mirrorClassNames}></div>
            </div>
        </Label>
    );
};
CheckBox.propTypes = {
    // State related propTypes.
    isChecked: PropTypes.bool.isRequired,

    // Style related propTypes.
    className: PropTypes.string,

    // Content related propTypes.
    label: PropTypes.string.isRequired,

    // Interaction related propTypes.
    onChange: PropTypes.func
};

export default CheckBox;
