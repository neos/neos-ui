import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$get} from 'plow-js';
import {neos} from '@neos-project/neos-ui-decorators';
import {selectors} from '@neos-project/neos-ui-redux-store';
import style from './style.css';
import Hero from './hero';
import Column from './column';

@connect(state => ({
    focusedNodeContextPath: selectors.CR.Nodes.focusedNodePathSelector(state),
    getNodeByContextPath: selectors.CR.Nodes.nodeByContextPath(state)
}))
@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n'),
    dataSourcesDataLoader: globalRegistry.get('dataLoaders').get('DataSources')
}))
export default class ColumnView extends PureComponent {
    static propTypes = {
        focusedNodeContextPath: PropTypes.string,
        getNodeByContextPath: PropTypes.func.isRequired,

        i18nRegistry: PropTypes.object.isRequired,
        options: PropTypes.shape({
            arguments: PropTypes.object,
            dataSource: PropTypes.string,
            dataSourceUri: PropTypes.string
        }).isRequired,
        dataSourcesDataLoader: PropTypes.shape({
            resolveValue: PropTypes.func.isRequired
        }).isRequired
    }

    state = {
        data: null
    };

    componentDidMount() {
        const dataSourceAdditionalData = Object.assign({node: this.props.focusedNodeContextPath}, this.props.options.arguments);

        this.props.dataSourcesDataLoader.resolveValue(
            {
                contextNodePath: this.props.focusedNodeContextPath,
                dataSourceIdentifier: this.props.options.dataSource,
                dataSourceUri: this.props.options.dataSourceUri,
                dataSourceAdditionalData
            }).then(response => {
                this.setState({
                    data: response.data
                });
            });
    }

    render() {
        const {focusedNodeContextPath, getNodeByContextPath, options} = this.props;

        const node = getNodeByContextPath(focusedNodeContextPath);
        const nodeType = $get('nodeType', node);

        const response = {"data":{"totals":{"ga_pageviews":"27907","ga_uniquePageviews":"19561","ga_users":"4758"},"rows":[{"ga_pageviews":"27907","ga_uniquePageviews":"19561","ga_users":"4758"}]}};

        const data = response.data;

        let hero = null;
        if (data && options.hero) {
            hero = {
                label: options.hero.label,
                value: $get(options.hero.data, data)
            };
        }

        const columns = [];
        if (data && options.columns) {
            options.columns.forEach(column => {
                columns.push({
                    label: column.label,
                    value: $get(column.data, data)
                });
            });
        }

        return (
            <div>
                {hero && <Hero label={hero.label} value={hero.value}/>}
                <div className={style.columnsWrap}>
                    {columns.map((column, key) => (
                        <Column
                            key={key}
                            value={column.value}
                            label={column.label}
                            />
                    ))}
                </div>
            </div>
        );
    }
}
