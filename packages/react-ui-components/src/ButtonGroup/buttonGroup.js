import React from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';
import ButtonGroupItem from './buttonGroupItem.js';

const ButtonGroup = props => {
    const {
        children,
        className,
        theme,
        value,
        ...rest
    } = props;
    const finalClassName = mergeClassNames({
        [theme.buttonGroup]: true,
        [className]: className && className.length
    });

    return (
        <div {...rest} className={finalClassName}>
            {React.Children.map(children, (child, index) => {
                return (
                    <ButtonGroupItem
                        {...child.props}
                        key={index}
                        onClick={this.props.onSelect}
                        isPressed={value === child.props.id}
                        element={child}
                        />
                );
            })}
        </div>
    );
};
ButtonGroup.propTypes = {
    /**
     * An optional `className` to attach to the wrapper.
     */
    className: PropTypes.string,

    /**
     * Current value
     */
    value: PropTypes.any,

    /**
     * Called when new value is selected. Returns an id of the activated button
     */
    onSelect: PropTypes.func.isRequired,

    /**
     * The contents to be rendered within the `Bar`.
     */
    children: PropTypes.any.isRequired,

    /**
     * An optional css theme to be injected.
     */
    theme: PropTypes.shape({
        buttonGroup: PropTypes.string
    }).isRequired
};

export default ButtonGroup;
