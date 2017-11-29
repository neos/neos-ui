import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const Fragment = props => props.children;

export default class SelectBox_ListPreview extends PureComponent {
    static propTypes = {
        onCreateNew: PropTypes.func,
        searchTerm: PropTypes.string,
        // dependency injection
        SelectBox_ListPreviewUngrouped: PropTypes.any.isRequired
    }

    render() {
        const {
            onCreateNew,
            searchTerm,
            SelectBox_CreateNew,
            SelectBox_ListPreviewUngrouped
        } = this.props;

        const isCreateNewEnabled = onCreateNew && searchTerm;

        // TODO: check whether we have grouped elements in the list; then render <ListPreviewGrouped> instead!
        return (
            <Fragment>
                <SelectBox_ListPreviewUngrouped {...this.props} />
                {isCreateNewEnabled && <SelectBox_CreateNew {...this.props} />}
            </Fragment>
        );
    }
}
