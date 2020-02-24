import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {neos} from '@neos-project/neos-ui-decorators';
import {selectors} from '@neos-project/neos-ui-redux-store';
import Widget from '../../Widget/index';
import Icon from '@neos-project/react-ui-components/src/Icon/';
import I18n from '@neos-project/neos-ui-i18n';
import style from './style.css';
import isEqual from 'lodash.isequal';

/*
 * This HOC is responsible for fetching data for Data views and wraping
 * them into Widget presentational component.
 */
@connect(state => ({
    focusedNodeContextPath: selectors.CR.Nodes.focusedNodePathSelector(state),
    getNodeByContextPath: selectors.CR.Nodes.nodeByContextPath(state)
}))
@neos(globalRegistry => ({
    dataSourcesDataLoader: globalRegistry.get('dataLoaders').get('DataSources')
}))
export default () => WrappedComponent => {
    return class DataLoader extends PureComponent {
        static propTypes = {
            focusedNodeContextPath: PropTypes.string,
            getNodeByContextPath: PropTypes.func.isRequired,

            label: PropTypes.string,
            options: PropTypes.shape({
                arguments: PropTypes.object,
                dataSource: PropTypes.string,
                dataSourceUri: PropTypes.string,
                subtitle: PropTypes.string
            }).isRequired,
            dataSourcesDataLoader: PropTypes.shape({
                resolveValue: PropTypes.func.isRequired
            }).isRequired
        }

        state = {
            data: null,
            error: false
        };

        componentDidMount() {
            this.fetchData();
        }

        componentDidUpdate(prevProps) {
            if (prevProps.focusedNodeContextPath !== this.props.focusedNodeContextPath ||
                !isEqual(prevProps.options.arguments, this.props.options.arguments)) {
                this.fetchData();
            }
        }

        fetchData() {
            const dataSourceAdditionalData = Object.assign({node: this.props.focusedNodeContextPath}, this.props.options.arguments);

            this.props.dataSourcesDataLoader.resolveValue(
                {
                    contextNodePath: this.props.focusedNodeContextPath,
                    dataSourceIdentifier: this.props.options.dataSource,
                    dataSourceUri: this.props.options.dataSourceUri,
                    dataSourceAdditionalData
                }).then(response => {
                    if (response.error) {
                        this.setState({
                            data: null,
                            error: response.error
                        });
                    } else if (response.data) {
                        this.setState({
                            data: response.data,
                            error: false
                        });
                    } else {
                        this.setState({
                            data: null,
                            error: new Error('Unknown datasource fetch error')
                        });
                    }
                });
        }

        getContent() {
            if (this.state.error) {
                return (<div><Icon icon="exclamation-triangle" className={style.warnIcon}/> {this.state.error.message}</div>);
            }

            if (!this.state.data) {
                return (<div><I18n id="Neos.Neos:Main:loading"/></div>);
            }

            return (<WrappedComponent data={this.state.data} {...this.props}/>);
        }

        render() {
            return (
                <Widget
                    label={this.props.label}
                    subtitle={this.props.options.subtitle}
                    >
                    {this.getContent()}
                </Widget>
            );
        }
    };
};
