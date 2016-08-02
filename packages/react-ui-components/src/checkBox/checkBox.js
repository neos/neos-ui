import React, {PropTypes} from 'react';
import mergeClassNames from 'classnames';

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
        theme,
        ...rest
    } = props;
    const classNames = mergeClassNames({
        [className]: className && className.length,
        [theme.checkbox]: true
    });
    const mirrorClassNames = mergeClassNames({
        [theme.checkbox__inputMirror]: true,
        [theme['checkbox__inputMirror--active']]: isChecked
    });

    return (
        <div className={classNames}>
            <input
                {...rest}
                className={theme.checkbox__input}
                type="checkbox"
                role="checkbox"
                checked={isChecked}
                aria-checked={isChecked}
                onChange={() => onChangeHandler(onChange, !isChecked)}
                />
            <div className={mirrorClassNames}/>
        </div>
    );
};
CheckBox.propTypes = {
    isChecked: PropTypes.bool.isRequired,
    className: PropTypes.string,
    onChange: PropTypes.func,
    theme: PropTypes.shape({
        'checkbox': PropTypes.string,
        'checkbox__input': PropTypes.string,
        'checkbox__inputMirror': PropTypes.string,
        'checkbox__inputMirror--active': PropTypes.string
    }).isRequired
};

export default CheckBox;
