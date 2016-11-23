import React, {PureComponent, PropTypes} from 'react';

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

    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
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

    handleClick() {
        const {onClick, id} = this.props;

        onClick(id);
    }
}
