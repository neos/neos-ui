import React, {PropTypes, PureComponent} from 'react';
import omit from 'lodash.omit';

export default class ButtonGroupItem extends PureComponent {
    static propTypes = {
        id: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired,
        element: PropTypes.any.isRequired
    };

    constructor(props) {
        super(props);
        this.handleButtonClick = this.handleButtonClick.bind(this);
    }

    handleButtonClick() {
        this.props.onClick(this.props.id);
    }

    render() {
        const {element, ...restProps} = this.props;
        const rest = omit(restProps, ['onClick']);
        return (
            React.cloneElement(element, {
                ...rest,
                onClick: this.handleButtonClick
            })
        );
    }
}
