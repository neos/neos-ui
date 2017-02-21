import SelectBox from '@neos-project/react-ui-components/lib/SelectBox/';
import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$get, $transform} from 'plow-js';

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
            PropTypes.bool,
            PropTypes.object
        ])),
        formattingRule: PropTypes.string,

        // The current guest frames window object.
        context: PropTypes.object
    };

    constructor(...args) {
        super(...args);
        this.handleLinkButtonClick = this.handleLinkButtonClick.bind(this);
    }

    handleLinkButtonClick() {
        if (this.isOpen()) {
            this.props.context.NeosCKEditorApi.toggleFormat(this.props.formattingRule, {remove: true});
        } else {
            this.props.context.NeosCKEditorApi.toggleFormat(this.props.formattingRule, {href: ''});
        }
    }

    render() {
        return (
            <div>
                <IconButton
                    isActive={this.getHrefValue()}
                    icon="link"
                    onClick={this.handleLinkButtonClick}
                    />
                {this.isOpen() ? <LinkTextField hrefValue={this.getHrefValue()} formattingRule={this.props.formattingRule}/> : null}
            </div>
        );
    }

    isOpen() {
        return this.getHrefValue() === '' || this.getHrefValue();
    }

    getHrefValue() {
        return $get([this.props.formattingRule, 'href'], this.props.formattingUnderCursor);
    }
}

const stripNodePrefix = str =>
    str && str.replace('node://', '');

@connect($transform({
    contextForNodeLinking: selectors.UI.NodeLinking.contextForNodeLinking,
    context: selectors.Guest.context
}))
class LinkTextField extends PureComponent {

    static propTypes = {
        formattingRule: PropTypes.string,
        hrefValue: PropTypes.string,

        contextForNodeLinking: PropTypes.object.isRequired,
        // The current guest frames window object.
        context: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.searchNodes = backend.get().endpoints.searchNodes;
        this.optionGenerator = this.optionGenerator.bind(this);
        this.handleLinkSelect = this.handleLinkSelect.bind(this);
    }

    render() {
        return (
            <div className={style.linkIconButton__flyout}>
                <SelectBox
                    placeholder="Paste a link, or search"
                    options={this.optionGenerator}
                    value={stripNodePrefix(this.props.hrefValue)}
                    onSelect={this.handleLinkSelect}
                    />
            </div>
        );
    }

    optionGenerator({value, callback}) {
        const searchNodesQuery = this.props.contextForNodeLinking.toJS();

        if (!value && this.props.hrefValue) {
            // Init case: load the value
            searchNodesQuery.nodeIdentifiers = [stripNodePrefix(this.props.hrefValue)];
        } else {
            // Search case
            searchNodesQuery.searchTerm = value;
        }

        this.searchNodes(searchNodesQuery).then(result => {
            callback(result);
        });
    }

    handleLinkSelect(link) {
        this.props.context.NeosCKEditorApi.toggleFormat(this.props.formattingRule, {href: 'node://' + link});
    }
}
