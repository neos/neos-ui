import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import style from './style.module.css';
// eslint-disable-next-line camelcase
import SelectBox_Option_SingleLine from '@neos-project/react-ui-components/src/SelectBox_Option_SingleLine/index';
import mergeClassNames from 'classnames';

export default class DimensionSelectorOption extends PureComponent {
    static propTypes = {
        option: PropTypes.shape({
            label: PropTypes.string.isRequired,
            disallowed: PropTypes.bool,
            existing: PropTypes.bool
        })
    };
    render() {
        const {option} = this.props;
        const className = mergeClassNames({
            [style.disallowed]: option.disallowed,
            [style.nonExistent]: !option.existing
        });

        return (
            // eslint-disable-next-line camelcase
            <SelectBox_Option_SingleLine
                {...this.props}
                className={className}
                label={option.label}
            />
        );
    }
}
