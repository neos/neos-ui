import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$get, $transform} from 'plow-js';

import IconButton from '@neos-project/react-ui-components/src/IconButton/';
import SelectBox from '@neos-project/react-ui-components/src/SelectBox/';
import SelectBoxOption from '@neos-project/react-ui-components/src/SelectBox/selectBoxOption';
import {neos} from '@neos-project/neos-ui-decorators';
import {getGuestFrameWindow} from '@neos-project/neos-ui-guest-frame/src/dom';

import {selectors} from '@neos-project/neos-ui-redux-store';

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
                    isActive={Boolean(this.getHrefValue())}
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

const isUri = str =>
    str && Boolean(str.match('^(https?://|mailto:|tel:)'));

@neos(globalRegistry => ({
    linkLookupDataLoader: globalRegistry.get('dataLoaders').get('LinkLookup')
}))
@connect($transform({
    contextForNodeLinking: selectors.UI.NodeLinking.contextForNodeLinking
}))
class LinkTextField extends PureComponent {

    static propTypes = {
        formattingRule: PropTypes.string,
        hrefValue: PropTypes.string,

        linkLookupDataLoader: PropTypes.shape({
            resolveValue: PropTypes.func.isRequired,
            search: PropTypes.func.isRequired
        }).isRequired,

        contextForNodeLinking: PropTypes.shape({
            toJS: PropTypes.func.isRequired
        }).isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            searchTerm: '',
            isLoading: false,
            searchOptions: [],
            options: []
        };
    }

    getDataLoaderOptions() {
        return {
            nodeTypes: ['Neos.Neos:Document'],
            contextForNodeLinking: this.props.contextForNodeLinking.toJS()
        };
    }

    componentDidMount() {
        if (isUri(this.props.hrefValue)) {
            this.setState({
                searchTerm: this.props.hrefValue
            });
        } else {
            if (this.props.hrefValue) {
                this.setState({isLoading: true});
                this.props.linkLookupDataLoader.resolveValue(this.getDataLoaderOptions(), this.props.hrefValue)
                    .then(options => {
                        this.setState({
                            isLoading: false,
                            options
                        });
                    });
            }
            this.setState({
                searchTerm: ''
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.hrefValue !== this.props.hrefValue) {
            this.componentDidMount();
        }
    }

    handleSearchTermChange = searchTerm => {
        this.setState({searchTerm});
        if (isUri(searchTerm)) {
            this.setState({isLoading: false});
            getGuestFrameWindow().NeosCKEditorApi
                .toggleFormat(this.props.formattingRule, {href: searchTerm});
        } else if (searchTerm) {
            this.setState({isLoading: true, searchOptions: []});
            this.props.linkLookupDataLoader.search(this.getDataLoaderOptions(), searchTerm)
                .then(searchOptions => {
                    this.setState({
                        isLoading: false,
                        searchOptions
                    });
                });
        }
    }

    // A node has been selected
    handleValueChange = value => {
        if (!value) {
            getGuestFrameWindow().NeosCKEditorApi
                .toggleFormat(this.props.formattingRule, {href: ''});
        }

        getGuestFrameWindow().NeosCKEditorApi
        .toggleFormat(this.props.formattingRule, {href: value});

        const options = this.state.searchOptions.reduce((current, option) =>
            (option.loaderUri === value) ? [Object.assign({}, option)] : current
        , []);

        this.setState({options, searchOptions: []});
    }

    render() {
        return (
            <div className={style.linkIconButton__flyout}>
                <SelectBox
                    options={this.props.hrefValue ? this.state.options : this.state.searchOptions}
                    optionValueField="loaderUri"
                    value={this.props.hrefValue}
                    onValueChange={this.handleValueChange}
                    placeholder="Paste a link, or search"
                    displayLoadingIndicator={this.state.isLoading}
                    displaySearchBox={true}
                    setFocus={true}
                    searchTerm={this.state.searchTerm}
                    onSearchTermChange={this.handleSearchTermChange}
                    optionComponent={LinkOption}
                    />
            </div>
        );
    }
}

class ImageOption extends PureComponent {
    static propTypes = {
        option: PropTypes.shape({
            label: PropTypes.string,
            preview: PropTypes.string,
            loaderUri: PropTypes.string
        }),
    };

    render() {
        const option = this.props.option;

        return (
            <SelectBoxOption {...this.props} className={style.linkIconButton__item}>
                <img src={option.preview} className={style.linkIconButton__image} />
                <span className={style.linkIconButton__line}>{option.label}</span>
                <span className={style.linkIconButton__link}>{option.dataType}</span>
            </SelectBoxOption>
        );
    }
}


class NodeOption extends PureComponent {
    static propTypes = {
        option: PropTypes.shape({
            label: PropTypes.string,
            uriInLiveWorkspace: PropTypes.string,
            nodeType: PropTypes.string,
            loaderUri: PropTypes.string
        }),

        nodeTypesRegistry: PropTypes.object.isRequired
    };

    render() {
        const {option, nodeTypesRegistry} = this.props;
        const {label, uriInLiveWorkspace, nodeType} = option;
        const nodeTypeDefinition = nodeTypesRegistry.getNodeType(nodeType);
        const icon = $get('ui.icon', nodeTypeDefinition);
        return (
            <SelectBoxOption {...this.props} className={style.linkIconButton__item} icon={icon}>
                <span>{label}</span>
                <span className={style.linkIconButton__link}>{uriInLiveWorkspace}</span>
                <span className={style.linkIconButton__link}>{option.dataType}</span>
            </SelectBoxOption>
        );
    }
}

const WrappedNodeOption = neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}))(NodeOption);

class LinkOption extends PureComponent {
    static propTypes = {
        option: PropTypes.object
    };

    render() {
        const option = this.props.option;

        if (option.dataType === 'Neos.ContentRepository:Node') {
            return <WrappedNodeOption {...this.props} />
        }

        if (option.dataType === 'Neos.Media:Asset') {
            return <ImageOption {...this.props} />
        }

        return <SelectBoxOption {...this.props}><span>{label}</span></SelectBoxOption>
    }
}
