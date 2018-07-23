import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';

class Tooltip extends PureComponent {
    static propTypes = {
        /**
         * An optional className to render on the tooltip node.
         */
        className: PropTypes.string,

        /**
         * The children to render within the tooltip node.
         */
        children: PropTypes.node,

        /**
         * If set to true the tooltip won't be positioned absolute but relative and
         * show up inline
         */
        renderInline: PropTypes.bool,

        /**
         * An optional css theme to be injected.
         */
        theme: PropTypes.object,

        /**
         * Whether this tooltip should indicate an error or not
         */
        asError: PropTypes.bool
    }

    static defaultProps = {
        renderInline: false
    }

    render() {
        const {
            children,
            className,
            theme,
            renderInline,
            asError,
            ...rest
        } = this.props;
        const classNames = mergeClassNames({
            [theme.tooltip]: true,
            [theme['tooltip--asError']]: asError,
            [theme['tooltip--inline']]: renderInline,
            [className]: className && className.length
        });

        return (
            <div {...rest} className={classNames}>
                <div className={theme['tooltip--arrow']}/>
                <div className={theme['tooltip--inner']}>
                    {children}
                </div>
            </div>
        );
    }
}

export default Tooltip;
