import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

export default class DropDownItem extends PureComponent {
    static propTypes = {
        /**
         * The handler to call when clicking on the item of the DropDown.
         */
        onClick: PropTypes.func.isRequired,

        /**
         * The ID to reference the clicked item in the `onClick` handker.
         */
        id: PropTypes.string.isRequired,

        /**
         * The children to render within the anchor.
         */
        children: PropTypes.element.isRequired
    };

    handleClick = () => {
        const {onClick, id} = this.props;

        onClick(id);
    }

    render() {
        const {children, ...rest} = this.props;

        return (
            <a
                {...rest}
                role="button"
                onClick={this.handleClick}
                >
                {children}
            </a>
        );
    }

}
