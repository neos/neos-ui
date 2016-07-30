import React, {PropTypes} from 'react';
import mergeClassNames from 'classnames';
// import style from './style.css';

const onChangeHandler = (cb, isChecked) => {
    if (cb) {
        cb(isChecked);
    }
};

const CheckBox = props => {
    const {
        isChecked,
        className,
        onChange,
        style,
        ...rest
    } = props;
    const classNames = mergeClassNames({
        [className]: className && className.length,
        [style.checkbox]: true
    });
    const mirrorClassNames = mergeClassNames({
        [style.checkbox__inputMirror]: true,
        [style['checkbox__inputMirror--active']]: isChecked
    });

    return (
        <div className={classNames}>
            <input
                {...rest}
                className={style.checkbox__input}
                type="checkbox"
                role="checkbox"
                checked={isChecked}
                aria-checked={isChecked}
                onChange={() => onChangeHandler(onChange, !isChecked)}
                />
            <div className={mirrorClassNames}></div>
        </div>
    );
};
CheckBox.propTypes = {
    isChecked: PropTypes.bool.isRequired,
    className: PropTypes.string,
    onChange: PropTypes.func,
    style: PropTypes.object
};
CheckBox.defaultProps = {
    style: {}
};

export default CheckBox;
