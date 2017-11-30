import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const Fragment = props => props.children;

/**
 * **SelectBox_ListPreview is an internal implementation detail of SelectBox**, meant to improve code quality.
 * 
 * It is used inside SelectBox as the dropdown part.
 */
export default class SelectBox_ListPreview extends PureComponent {
    static propTypes = {
        // dependency injection
        SelectBox_CreateNew: PropTypes.any.isRequired,
        SelectBox_ListPreviewUngrouped: PropTypes.any.isRequired
    };

    render() {
        const {
            SelectBox_CreateNew,
            SelectBox_ListPreviewUngrouped
        } = this.props;

        // TODO: check whether we have grouped elements in the list; then render <ListPreviewGrouped> instead!
        return (
            <Fragment>
                <SelectBox_ListPreviewUngrouped {...this.props} />
                <SelectBox_CreateNew {...this.props} />
            </Fragment>
        );
    }
}
