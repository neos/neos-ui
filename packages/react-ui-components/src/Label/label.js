import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';

class Label extends PureComponent {
    static propTypes = {
        /**
         * The `for` standard html attribute, defined to make it always required.
         */
        htmlFor: PropTypes.string.isRequired,

        /**
         * An optional className to render on the label node.
         */
        className: PropTypes.string,

        /**
         * The children to render within the label node.
         */
        children: PropTypes.node,

        /**
         * An optional css theme to be injected.
         */
        theme: PropTypes.object
    }

    render() {
        const {
            children,
            className,
            htmlFor,
            theme,
            ...rest
        } = this.props;
        const classNames = mergeClassNames({
            [theme.label]: true,
            [className]: className && className.length
        });

        return (
            <label {...rest} htmlFor={htmlFor} className={classNames}>
                {children}
            </label>
        );
    }
}

export default Label;
