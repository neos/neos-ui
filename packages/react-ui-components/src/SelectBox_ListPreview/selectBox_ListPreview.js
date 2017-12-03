/* eslint-disable camelcase, react/jsx-pascal-case */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

const Fragment = props => props.children;

/**
 * **SelectBox_ListPreview is an internal implementation detail of SelectBox**, meant to improve code quality.
 *
 * It is used inside SelectBox as the dropdown part.
 */
export default class SelectBox_ListPreview extends PureComponent {
    static propTypes = {
        // For explanations of the PropTypes, see SelectBox.js
        options: PropTypes.arrayOf(
            PropTypes.shape({
            }),
        ),

        // dependency injection
        SelectBox_CreateNew: PropTypes.any.isRequired,
        SelectBox_ListPreviewFlat: PropTypes.any.isRequired,
        SelectBox_ListPreviewGrouped: PropTypes.any.isRequired
    };

    render() {
        const {
            options,
            SelectBox_CreateNew,
            SelectBox_ListPreviewFlat,
            SelectBox_ListPreviewGrouped
        } = this.props;

        const ListPreviewComponent = options.some(option => option.group) ? SelectBox_ListPreviewGrouped : SelectBox_ListPreviewFlat;

        // TODO: check whether we have grouped elements in the list; then render <ListPreviewGrouped> instead!
        return (
            <Fragment>
                <ListPreviewComponent {...this.props}/>
                <SelectBox_CreateNew {...this.props}/>
            </Fragment>
        );
    }
}
