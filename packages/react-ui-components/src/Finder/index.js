import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';
import SearchInput from './SearchInput';
import GroupedPreviewList from '../Previews/GroupedPreviewList';

export default class Finder extends PureComponent {
    state = {
        searchTerm: ''
    };

    static propTypes = {
        /**
         * This prop represents a set of options.
         * Each option must have a value and can have a label and an icon.
         */
        options: PropTypes.arrayOf(
            PropTypes.shape({
                __value: PropTypes.string.isRequired,
                icon: PropTypes.string,
                label: PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.object
                ]).isRequired
            })
        ),

        previewRenderer: PropTypes.func.isRequired,

        classNames: PropTypes.object.isRequired,
        onValueChange: PropTypes.func.isRequired,
        onSearchTermChange: PropTypes.func.isRequired,
        theme: PropTypes.object.isRequired,
        IconComponent: PropTypes.any.isRequired,
        TextInputComponent: PropTypes.any.isRequired
    };

    handleValueChange = newValue => {
        this.setState({searchTerm: ''});
        this.props.onValueChange(newValue);
    }

    handleSearchTermChange = searchTerm => {
        this.setState({searchTerm});
        this.props.onSearchTermChange(searchTerm);
    }

    render() {
        const {
            classNames,
            options,
            previewRenderer,
            theme,
            IconComponent,
            TextInputComponent
        } = this.props;

        const finalClassName = mergeClassNames(Object.assign(classNames, {
            [theme.selectBox]: theme.selectBox
        }));

        return (
            <div className={finalClassName}>
                <SearchInput
                    value={this.state.searchTerm}
                    onChange={this.handleSearchTermChange}
                    theme={theme}
                    IconComponent={IconComponent}
                    TextInputComponent={TextInputComponent}
                    />
                {this.state.searchTerm && this.props.options &&
                <GroupedPreviewList
                    options={options}
                    previewRenderer={previewRenderer}
                    onChange={this.handleValueChange}
                    theme={theme}
                    />
                }
            </div>
        );
    }
}
