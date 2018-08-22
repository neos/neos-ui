import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';

class Badge extends PureComponent {
    static propTypes = {
        /**
         * An optional `className` to attach to the wrapper.
         */
        className: PropTypes.string,

        /**
         * Badge's label.
         */
        label: PropTypes.string,

        /**
         * An optional css theme to be injected.
         */
        theme: PropTypes.shape({
            badge: PropTypes.string
        }).isRequired
    };

    render() {
        const {
            className,
            theme,
            label,
            ...rest
        } = this.props;
        const finalClassName = mergeClassNames({
            [theme.badge]: true,
            [className]: className && className.length
        });
        const attributes = {};

        return (
            <div {...rest} {...attributes} className={finalClassName}>{label}</div>
        );
    }
}

export default Badge;
