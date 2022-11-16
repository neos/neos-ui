/* eslint-disable camelcase, react/jsx-pascal-case */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import SelectBox_Option_MultiLineWithThumbnail from '@neos-project/react-ui-components/src/SelectBox_Option_MultiLineWithThumbnail';

export default class PreviewOption extends PureComponent {
    static propTypes = {
        option: PropTypes.shape({
            label: PropTypes.string.isRequired,
            secondaryLabel: PropTypes.string,
            tertiaryLabel: PropTypes.string,
            icon: PropTypes.string,
            preview: PropTypes.string
        })
    };

    render() {
        const {option} = this.props;

        return (
            <SelectBox_Option_MultiLineWithThumbnail {...this.props} imageUri={option.preview} icon={option.icon} label={option.label} secondaryLabel={option.secondaryLabel} tertiaryLabel={option.tertiaryLabel}/>
        );
    }
}
