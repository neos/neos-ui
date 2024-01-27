import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Icon, IconButton} from '@neos-project/react-ui-components';
import style from './style.module.css';
import cx from 'classnames';
import {neos} from '@neos-project/neos-ui-decorators';
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
@connect(state => ({
    focusedNodePath: selectors.CR.Nodes.focusedNodePathSelector(state)
}))

export default class ButtonEditor extends Component {
    static propTypes = {
        commit: PropTypes.func.isRequired,
        highlight: PropTypes.bool,
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
        allowEmpty: true,
        multiple: false,
        disabled: false
    };

    state = {
        selected: [],
        isLoading: false,
        buttons: []
    };

    options = {};

    initialValueType = 'string';

    constructor(props) {
        super(props);
        const {commit, options, value} = props;
        this.options = Object.assign({}, this.constructor.defaultOptions, options)
        // TODO: get actual property data type
        this.initialValueType = Array.isArray(value) ? 'array' : 'string';
        if (this.options.multiple && this.initialValueType === 'string') {
            console.warn(`Misconfiguration in property "${props.identifier}". Multiple is activated but value type seems to be "string" but should be "array".`);
        }

        this.state = {
            selected: Array.isArray(value) ? value : (value ? [value] : []),
            buttons: this.hasDataSource() ? [] : this.createButtonsFromConfiguration(this.options.values)
        };
        this.commit = commit;
    }

    hasDataSource() {
        return this.options.dataSourceIdentifier || this.options.dataSourceUri;
    }

    componentDidMount() {
        if (this.hasDataSource()) {
            this.loadDataSourceOptions();
        }
    }

    loadDataSourceOptions() {
        this.setState({isLoading: true});
        this.props.dataSourcesDataLoader.resolveValue(getDataLoaderOptionsForProps(this.props), this.props.value)
            .then(configuredValues => {
                this.setState({
                    isLoading: false,
                    buttons: this.createButtonsFromConfiguration(configuredValues)
                });
            });
    }

    createButtonsFromConfiguration(configuredValues) {
        return Object.entries(configuredValues).map(([key, configuredValue]) => {
            return {
                value: configuredValue.value ?? key,
                label: this.props.i18nRegistry.translate(configuredValue.label),
                icon: configuredValue.icon,
                iconActive: configuredValue.iconActive
            };
        });
    }

    handleSelect(selectedValue) {
        const {multiple, allowEmpty} = this.options;
        // we'd like to have a copy instead of ref
        let selected = [...this.state.selected];
        if (multiple === false) {
            if (selected.includes(selectedValue)) {
                selected = [];
            } else {
                selected = [selectedValue];
            }
        } else if (selected.includes(selectedValue)) {
            selected.splice(selected.indexOf(selectedValue), 1);
        } else {
            selected.push(selectedValue);
        }

        // if allowEmpty is false but new selected length will be 0, drop changes
        if (!allowEmpty && selected.length === 0) {
            return;
        }
        this.setState({selected});

        this.commit(this.initialValueType === 'string' ? selected[0] || '' : selected);
    }

    isSelected(val) {
        return this.state.selected.includes(val);
    }

    render() {
        return (<div className={cx(style.buttonEditor, this.props.highlight && style.buttonEditorHighlight)}>
            {
                this.state.isLoading
                    ? <Icon icon="spinner" size="lg" spin/>
                    : this.state.buttons.map((button) => (<IconButton
                            key={button.value}
                            style="lighter"
                            hoverStyle="darken"
                            className={style.button}
                            icon={button.iconActive ? (this.isSelected(button.value) ? button.iconActive : button.icon) : button.icon}
                            title={button.label}
                            disabled={this.options.disabled || button.disabled}
                            isActive={this.isSelected(button.value)}
                            onClick={this.handleSelect.bind(this, button.value)}
                    />))
            }
        </div>);
    }
}
