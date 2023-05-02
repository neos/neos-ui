import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Icon, IconButton} from '@neos-project/react-ui-components';
import style from './style.module.css';

import {neos} from '@neos-project/neos-ui-decorators';
import {$transform} from 'plow-js';
import {connect} from 'react-redux';
import {selectors} from '@neos-project/neos-ui-redux-store';

const getDataLoaderOptionsForProps = props => ({
    contextNodePath: props.focusedNodePath,
    dataSourceIdentifier: props.options.dataSourceIdentifier,
    dataSourceUri: props.options.dataSourceUri,
    dataSourceAdditionalData: props.options.dataSourceAdditionalData,
    dataSourceDisableCaching: Boolean(props.options.dataSourceDisableCaching)
});

@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n'),
    dataSourcesDataLoader: globalRegistry.get('dataLoaders').get('DataSources')
}))
@connect($transform({
    focusedNodePath: selectors.CR.Nodes.focusedNodePathSelector
}))
export default class ButtonEditor extends Component {
    static propTypes = {
        commit: PropTypes.func.isRequired,
        value: PropTypes.any,
        className: PropTypes.string,
        options: PropTypes.shape({
            allowEmpty: PropTypes.bool,
            multiple: PropTypes.bool,
            disabled: PropTypes.bool,
            values: PropTypes.objectOf(PropTypes.shape({
                label: PropTypes.string,
                icon: PropTypes.string,
                iconActive: PropTypes.string,
                disabled: PropTypes.bool
            })),

            dataSourceIdentifier: PropTypes.string,
            dataSourceUri: PropTypes.string,
            dataSourceDisableCaching: PropTypes.bool,
            dataSourceAdditionalData: PropTypes.objectOf(PropTypes.any)
        }).isRequired,

        i18nRegistry: PropTypes.object.isRequired
    };

    static defaultOptions = {
        allowEmpty: false,
        multiple: false,
        disabled: false
    };

    state = {
        active: [],
        isLoading: false,
        buttons: []
    };

    initialValueType = 'string';

    constructor(props) {
        super(props);

        const {commit, options, value} = props;
        this.initialValueType = Array.isArray(value) ? 'array' : 'string';
        if (options.multiple && this.initialValueType === 'string') {
            console.warn(`Misconfiguration in property "${props.identifier}". Multiple is activated but value type seems to be "string" but should be "array".`);
        }

        this.state = {
            active: Array.isArray(value) ? value : (value ? [value] : []),
            buttons: this.hasDataSource() ? [] : this.flattenValues(options.values)
        };
        this.commit = commit;
    }

    hasDataSource() {
        return this.props.options.dataSourceIdentifier || this.props.options.dataSourceUri;
    }

    componentDidMount() {
        if (this.hasDataSource()) {
            this.loadOptions();
        }
    }

    loadOptions() {
        this.setState({isLoading: true});
        this.props.dataSourcesDataLoader.resolveValue(getDataLoaderOptionsForProps(this.props), this.props.value)
            .then(buttons => {
                this.setState({
                    isLoading: false,
                    buttons
                });
            });
    }

    flattenValues(values) {
        return Object.entries(values).map(([key, val]) => {
            return {...val, value: key, label: this.props.i18nRegistry.translate(val.label)};
        });
    }

    toggleActive(toggleValue) {
        const {multiple, allowEmpty} = this.props.options;
        // we'd like to have a copy instead of ref
        let active = [...this.state.active];
        if (multiple === false) {
            if (active.includes(toggleValue)) {
                active = [];
            } else {
                active = [toggleValue];
            }
        } else if (active.includes(toggleValue)) {
            active.splice(active.indexOf(toggleValue), 1);
        } else {
            active.push(toggleValue);
        }

        // if allowEmpty is false but new active length will be 0, drop changes
        if (!allowEmpty && active.length === 0) {
            return;
        }
        this.setState({active});

        this.commit(this.initialValueType === 'string' ? active[0] || '' : active);
    }

    isActive(val) {
        return this.state.active.includes(val);
    }

    render() {
        const options = Object.assign({}, this.constructor.defaultOptions, this.props.options);

        return (<div className={style.buttonEditor}>
            {
                this.state.isLoading
                    ? <Icon icon="spinner" size="lg" spin/>
                    : this.state.buttons.map((button) => (<IconButton
                            style="lighter"
                            hoverStyle="darken"
                            className={style.button}
                            icon={button.iconActive ? (this.isActive(button.value) ? button.iconActive : button.icon) : button.icon}
                            title={button.label}
                            disabled={options.disabled || button.disabled}
                            isActive={this.isActive(button.value)}
                            onClick={this.toggleActive.bind(this, button.value)}
                    />))
            }
        </div>);
    }
}
