import React, {Component, PropTypes} from 'react';

export default class DropDownItem extends Component {
    static propTypes = {
        onClick: PropTypes.func.isRequired,
        id: PropTypes.string.isRequired,
        children: PropTypes.any.isRequired
    };

    constructor(props) {
        super(props);

        this.handlClick = this.handlClick.bind(this);
    }

    render() {
        const {children, ...rest} = this.props;

        return (
            <a
                {...rest}
                role="button"
                onClick={this.handlClick}
                >
            {children}
            </a>
        );
    }

    handlClick() {
        const {onClick, id} = this.props;

        onClick(id);
    }
}
