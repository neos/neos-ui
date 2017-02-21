import SelectBox from '@neos-project/react-ui-components/lib/SelectBox/';
import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$transform} from 'plow-js';

import IconButton from '@neos-project/react-ui-components/lib/IconButton/';

import {selectors} from '@neos-project/neos-ui-redux-store';
import backend from '@neos-project/neos-ui-backend-connector';

import style from './style.css';

/**
 * The Actual StyleSelect component
 */
@connect($transform({
    formattingUnderCursor: selectors.UI.ContentCanvas.formattingUnderCursor,
    context: selectors.Guest.context
}))
export default class LinkIconButton extends PureComponent {

    static propTypes = {
        formattingUnderCursor: PropTypes.objectOf(PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.bool
        ])),
        isActive: PropTypes.bool,

        // The current guest frames window object.
        context: PropTypes.object
    };

    constructor(...args) {
        super(...args);
        this.handleLinkButtonClick = this.handleLinkButtonClick.bind(this);

        this.state = {
            isOpen: false
        };
    }

    handleLinkButtonClick() {
        this.setState({isOpen: !this.state.isOpen});
    }

    render() {
        return (
            <div>
                <IconButton
                    isActive={this.props.isActive || this.state.isOpen}
                    icon="link"
                    onClick={this.handleLinkButtonClick}
                    />
                {this.state.isOpen ? <LinkTextField/> : null}
            </div>
        );
    }

}

@connect($transform({
    contextForNodeLinking: selectors.UI.NodeLinking.contextForNodeLinking
}))
class LinkTextField extends PureComponent {

    static propTypes = {
        contextForNodeLinking: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.searchNodes = backend.get().endpoints.searchNodes;
        this.optionGenerator = this.optionGenerator.bind(this);
    }

    render() {
        return (
            <div className={style.linkIconButton__flyout}>
                <SelectBox
                    placeholder="Paste a link, or search"
                    options={this.optionGenerator}
                    value={''}
                    />
            </div>
        );
    }

    optionGenerator({value, callback}) {
        if (!value) {
            callback([]);
            return;
        }

        const searchNodesQuery = this.props.contextForNodeLinking.toJS();
        searchNodesQuery.searchTerm = value;

        this.searchNodes(searchNodesQuery).then(result => {
            callback(result);
        });
    }
}
