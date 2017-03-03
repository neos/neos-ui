import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import {actions} from '@neos-project/neos-ui-redux-store';
import IconButton from '@neos-project/react-ui-components/lib/IconButton/';

@connect(null, {
    commenceNodeCreation: actions.CR.Nodes.commenceCreation
})
export default class AddNode extends PureComponent {
    static propTypes = {
        contextPath: PropTypes.string,
        fusionPath: PropTypes.string,
        className: PropTypes.string,
        commenceNodeCreation: PropTypes.func.isRequired
    };

    handleCommenceNodeCreation = () => {
        const {
            commenceNodeCreation,
            contextPath,
            fusionPath
        } = this.props;

        commenceNodeCreation(contextPath, fusionPath);
    }

    render() {
        return (
            <span>
                <IconButton
                    className={this.props.className}
                    icon="plus"
                    onClick={this.handleCommenceNodeCreation}
                    hoverStyle="clean"
                    />
            </span>
        );
    }
}
