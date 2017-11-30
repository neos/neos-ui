import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import ListPreviewElement from '../ListPreviewElement/index';

export default class SelectBox_Option_SingleLine extends PureComponent {
    static propTypes = {
        option: PropTypes.shape({
            label: PropTypes.string.isRequired,
            icon: PropTypes.string
        }).isRequired
    };

    render() {
        const {option} = this.props;

        return (
            <ListPreviewElement {...this.props} icon={option.icon}>
                <span>{option.label}</span>
            </ListPreviewElement>
        );
    }
}
