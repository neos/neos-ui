import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash.omit';

class ButtonGroupItem extends PureComponent {
    static propTypes = {
        id: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired,
        element: PropTypes.any.isRequired
    };

    handleButtonClick() {
        const {onClick, id} = this.props;
        onClick(id);
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

export default ButtonGroupItem;
