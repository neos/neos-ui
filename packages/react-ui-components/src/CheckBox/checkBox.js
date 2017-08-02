import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';

class CheckBox extends PureComponent {
    static propTypes = {
        /**
         * This prop controls the visual active state of the CheckBox.
         */
        isChecked: PropTypes.bool.isRequired,

        /**
         * This prop controls if the CheckBox is disabled or not.
         */
        isDisabled: PropTypes.bool,

        /**
         * An optional `className` to attach to the wrapper.
         */
        className: PropTypes.string,

        /**
         * An optional change handler which gets called once the user clicks on the CheckBox.
         */
        onChange: PropTypes.func,

        /**
         * An optional css theme to be injected.
         */
        theme: PropTypes.shape({
            'checkbox': PropTypes.string,
            'checkbox__input': PropTypes.string,
            'checkbox__inputMirror': PropTypes.string,
            'checkbox__inputMirror--active': PropTypes.string
        }).isRequired
    };

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const {
            isChecked,
            isDisabled,
            className,
            theme,
            ...rest
        } = this.props;
        const finalClassName = mergeClassNames({
            [className]: className && className.length,
            [theme.checkbox]: true,
            [theme.checkbox__disabled]: isDisabled
        });
        const mirrorClassNames = mergeClassNames({
            [theme.checkbox__inputMirror]: true,
            [theme['checkbox__inputMirror--active']]: isChecked
        });

        return (
            <div className={finalClassName}>
                <input
                    {...rest}
                    className={theme.checkbox__input}
                    type="checkbox"
                    role="checkbox"
                    checked={isChecked}
                    aria-checked={isChecked}
                    onChange={this.handleChange}
                    disabled={isDisabled}
                    />
                <div className={mirrorClassNames}/>
            </div>
        );
    }

    handleChange() {
        const {onChange, isChecked} = this.props;

        if (onChange) {
            onChange(!isChecked);
        }
    }
}

export default CheckBox;
