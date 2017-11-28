import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Preview from '../Preview/index';

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
            <Preview {...this.props} icon={option.icon}>
                <span>{option.label}</span>
            </Preview>
        );
    }
}
