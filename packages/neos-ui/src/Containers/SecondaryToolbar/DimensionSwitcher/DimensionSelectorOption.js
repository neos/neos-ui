import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import style from './style.css';
// eslint-disable-next-line camelcase
import SelectBox_Option_SingleLine from '@neos-project/react-ui-components/src/SelectBox_Option_SingleLine/index';

export default class DimensionSelectorOption extends PureComponent {
    static propTypes = {
        option: PropTypes.shape({
            label: PropTypes.string.isRequired,
            disallowed: PropTypes.bool
        })
    };

    render() {
        const {option} = this.props;

        return (
            <SelectBox_Option_SingleLine
                {...this.props}
                className={option.disallowed ? style.dimmed : ''}
                label={option.label}
            />
        );
    }
}
