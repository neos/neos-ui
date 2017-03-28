import SelectBox from '@neos-project/react-ui-components/src/SelectBox/';
import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$get, $transform} from 'plow-js';

import IconButton from '@neos-project/react-ui-components/src/IconButton/';
import {getGuestFrameWindow} from '@neos-project/neos-ui-guest-frame/src/dom';

import {selectors} from '@neos-project/neos-ui-redux-store';
import backend from '@neos-project/neos-ui-backend-connector';

import style from './style.css';

/**
 * The Actual StyleSelect component
 */
@connect($transform({
    formattingUnderCursor: selectors.UI.ContentCanvas.formattingUnderCursor
}))
export default class LinkIconButton extends PureComponent {

    static propTypes = {
        formattingUnderCursor: PropTypes.objectOf(PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.bool,
            PropTypes.object
        ])),
        formattingRule: PropTypes.string
    };

    handleLinkButtonClick = () => {
        const {NeosCKEditorApi} = getGuestFrameWindow();

        if (this.isOpen()) {
            NeosCKEditorApi.toggleFormat(this.props.formattingRule, {remove: true});
        } else {
            NeosCKEditorApi.toggleFormat(this.props.formattingRule, {href: ''});
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
    contextForNodeLinking: selectors.UI.NodeLinking.contextForNodeLinking
}))
class LinkTextField extends PureComponent {

    static propTypes = {
        formattingRule: PropTypes.string,
        hrefValue: PropTypes.string,

        contextForNodeLinking: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.searchNodes = backend.get().endpoints.searchNodes;
        this.optionGenerator = this.optionGenerator.bind(this);
        this.handleLinkSelect = this.handleLinkSelect.bind(this);
        this.handleMakeLinkEmpty = this.handleMakeLinkEmpty.bind(this);
    }

    render() {
        return (
            <div className={style.linkIconButton__flyout}>
                <SelectBox
                    placeholder="Paste a link, or search"
                    options={this.optionGenerator}
                    value={stripNodePrefix(this.props.hrefValue)}
                    onSelect={this.handleLinkSelect}
                    onDelete={this.handleMakeLinkEmpty}
                    loadOptionsOnInput={true}
                    />
            </div>
        );
    }

    optionGenerator({value, searchTerm, callback}) {
        const searchNodesQuery = this.props.contextForNodeLinking.toJS();

        if (value) {
            // Init case: load the value
            searchNodesQuery.nodeIdentifiers = [stripNodePrefix(value)];
        } else if (searchTerm) {
            // Search case
            searchNodesQuery.searchTerm = searchTerm;
        } else {
            // empty search term and no value
            return;
        }

        this.searchNodes(searchNodesQuery).then(result => {
            callback(result);
        });
    }

    handleLinkSelect = link => {
        getGuestFrameWindow().NeosCKEditorApi
            .toggleFormat(this.props.formattingRule, {href: 'node://' + link});
    }

    handleMakeLinkEmpty() {
        getGuestFrameWindow().NeosCKEditorApi
            .toggleFormat(this.props.formattingRule, {href: ''});
    }
}
