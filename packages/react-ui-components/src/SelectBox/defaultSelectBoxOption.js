import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import SelectBoxOption from './selectBoxOption';

export default class DefaultSelectBoxOption extends PureComponent {
    static propTypes = {
        option: PropTypes.shape({
            label: PropTypes.string,
            icon: PropTypes.string
        })
    };

    render() {
        const {option} = this.props;

        return (
            <SelectBoxOption {...this.props} icon={option.icon}>
                <span>{option.label}</span>
            </SelectBoxOption>
        );
    }
}
