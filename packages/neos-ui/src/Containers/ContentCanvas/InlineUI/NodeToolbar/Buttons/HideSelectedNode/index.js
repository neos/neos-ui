import React, {PureComponent, PropTypes} from 'react';
import IconButton from '@neos-project/react-ui-components/lib/IconButton/';

export default class HideSelectedNode extends PureComponent {
    static propTypes = {
        isDisabled: PropTypes.bool,
        className: PropTypes.string
    };

    static defaultProps = {
        isDisabled: true
    };

    constructor(props) {
        super(props);

        this.handleHideSelectedNodeClick = this.hideSelectedNode.bind(this);
    }

    render() {
        const {
            isDisabled,
            className
        } = this.props;

        return (
            <IconButton
                className={className}
                isDisabled={isDisabled}
                onClick={this.handleHideSelectedNodeClick}
                icon="eye-slash"
                hoverStyle="clean"
                />
        );
    }

    hideSelectedNode() {
        console.log('hide selected node');
    }
}
