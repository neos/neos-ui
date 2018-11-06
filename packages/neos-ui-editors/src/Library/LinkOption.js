import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import AssetOption from './AssetOption';
import NodeOption from './NodeOption';
/* eslint-disable camelcase, react/jsx-pascal-case */
import SelectBox_Option_SingleLine from '@neos-project/react-ui-components/src/SelectBox_Option_SingleLine/index';

export default class LinkOption extends PureComponent {
    static propTypes = {
        option: PropTypes.shape({
            label: PropTypes.string.isRequired,
            loaderUri: PropTypes.string.isRequired,
            dataType: PropTypes.string
        })
    };

    render() {
        const {option} = this.props;

        if (option.dataType === 'Neos.ContentRepository:Node') {
            return <NodeOption {...this.props}/>;
        }

        if (option.dataType === 'Neos.Media:Asset') {
            return <AssetOption {...this.props}/>;
        }

        return <SelectBox_Option_SingleLine {...this.props}/>;
    }
}
