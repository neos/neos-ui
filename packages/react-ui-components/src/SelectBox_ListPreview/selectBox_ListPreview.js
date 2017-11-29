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

        // TODO: check whether we have grouped elements in the list; then render <ListPreviewGrouped> instead!
        return <SelectBox_ListPreviewUngrouped {...this.props} />
    }
}
