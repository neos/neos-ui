import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

class Panel extends PureComponent {
    static propTypes = {
        /**
         * The title to be rendered within the navigation item of this Panel.
         */
        title: PropTypes.string,

        /**
         * An optional icon identifier which will be rendered within the navigation item of this Panel.
         */
        icon: PropTypes.string,

        /**
         * The children to render within the div node.
         */
        children: PropTypes.any.isRequired,

        /**
         * An optional css theme to be injected.
         */
        theme: PropTypes.shape({/* eslint-disable quote-props */
            'panel': PropTypes.string
        }).isRequired/* eslint-enable quote-props */
    }

    render() {
        const {theme, children} = this.props;
        return (
            <div className={theme.panel}>{children}</div>
        );
    }
}

export default Panel;
