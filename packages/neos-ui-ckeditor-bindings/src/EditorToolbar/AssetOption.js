import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import ComplexOption from '@neos-project/react-ui-components/src/SelectBox/complexOption';

export default class AssetOption extends PureComponent {
    static propTypes = {
        option: PropTypes.shape({
            label: PropTypes.string.isRequired,
            loaderUri: PropTypes.string.isRequired,
            preview: PropTypes.string
        })
    };

    render() {
        const option = this.props.option;

        return (
            <ComplexOption {...this.props} imageUri={option.preview} label={option.label}/>
        );
    }
}
