import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import LinkInput from '@neos-project/neos-ui-editors/src/Library/LinkInput';

class LinkEditor extends PureComponent {
    static propTypes = {
        identifier: PropTypes.string.isRequired,
        className: PropTypes.string,
        value: PropTypes.string,
        commit: PropTypes.func.isRequired,
        options: PropTypes.shape({
            nodeTypes: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
            startingPoint: PropTypes.string,
            placeholder: PropTypes.string,
            disabled: PropTypes.bool
        })
    };

    render() {
        const {value, options} = this.props;

        return (
            <LinkInput
                linkValue={value}
                onLinkChange={this.props.commit}
                options={options}
                />
        );
    }
}

export default LinkEditor;
