import React, {Component, PropTypes} from 'react';
import ReactSelect from 'react-select';

function logChange(val) {
    console.log(val);
}

const Select = props => {
    logChange(props);

    return (
        <ReactSelect
            {...props}
            />
    );
};

class Option extends Component {
        static  propTypes = {
            children: PropTypes.node,
            className: PropTypes.string,
            isDisabled: PropTypes.bool,
            isFocused: PropTypes.bool,
            isSelected: PropTypes.bool,
            onFocus: PropTypes.func,
            onSelect: PropTypes.func,
            onUnfocus: PropTypes.func,
            option: PropTypes.object.isRequired
        }
        handleMouseDown (event) {
            event.preventDefault();
            event.stopPropagation();
            this.props.onSelect(this.props.option, event);
        }
        handleMouseEnter (event) {
            this.props.onFocus(this.props.option, event);
        }
        handleMouseMove (event) {
            if (this.props.isFocused) return;
            this.props.onFocus(this.props.option, event);
        }
        handleMouseLeave (event) {
            this.props.onUnfocus(this.props.option, event);
        }
        render () {

            return (
                <div className={this.props.className}
                    onMouseDown={this.handleMouseDown}
                    onMouseEnter={this.handleMouseEnter}
                    onMouseMove={this.handleMouseMove}
                    onMouseLeave={this.handleMouseLeave}
                    title={this.props.option.title}>
                    Test: {this.props.children}
                </div>
            );
        }
};



Select.propTypes = {
    optionComponent: PropTypes.element.isRequired
};

Select.defaultProps = {
    optionComponent: Option
};

export default Select;
