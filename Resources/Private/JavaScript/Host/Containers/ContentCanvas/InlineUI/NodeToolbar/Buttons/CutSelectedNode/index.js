import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import IconButton from '@neos-project/react-ui-components/lib/IconButton/';

export default class CutSelectedNode extends Component {
    static propTypes = {
        isDisabled: PropTypes.bool,
        className: PropTypes.string
    };

    static defaultProps = {
        isDisabled: true
    };

    constructor(props) {
        super(props);

        this.handleCutSelectedNodeClick = this.cutSelectedNode.bind(this);
    }

    shouldComponentUpdate(newProps, newState) {
        return shallowCompare(this, newProps, newState);
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
                onClick={this.handleCutSelectedNodeClick}
                icon="cut"
                hoverStyle="clean"
                />
        );
    }

    cutSelectedNode() {
        console.log('cut selected node');
    }
}
