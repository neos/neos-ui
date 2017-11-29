import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class SelectBox_ListPreview extends PureComponent {
    static propTypes = {
        // dependency injection
        SelectBox_ListPreviewUngrouped: PropTypes.any.isRequired
    }

    render() {
        const {
            SelectBox_ListPreviewUngrouped
        } = this.props;

        return <SelectBox_ListPreviewUngrouped {...this.props} />
    }
}
