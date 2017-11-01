import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import AssetOption from './AssetOption';
import NodeOption from './NodeOption';
import SelectBoxOption from '@neos-project/react-ui-components/src/SelectBox/selectBoxOption';

export default class LinkOption extends PureComponent {
    static propTypes = {
        option: PropTypes.shape({
            label: PropTypes.string.required,
            loaderUri: PropTypes.string.required,
            dataType: PropTypes.string.required
        }),
    };

    render() {
        const option = this.props.option;

        if (option.dataType === 'Neos.ContentRepository:Node') {
            return <NodeOption {...this.props} />
        }

        if (option.dataType === 'Neos.Media:Asset') {
            return <AssetOption {...this.props} />
        }

        return <SelectBoxOption {...this.props}><span>{label}</span></SelectBoxOption>
    }
}
