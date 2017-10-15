import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {neos} from '@neos-project/neos-ui-decorators';
import {selectors} from '@neos-project/neos-ui-redux-store';

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
            data: null,
            error: false
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
                            error: 'Unknown datasource fetch error'
                        });
                    }
                }).catch(reason => {
                    this.setState({
                        data: null,
                        error: reason
                    });
                });
        }

        render() {
            if (this.state.error) {
                return (<div>Datasource fetch error: {this.state.error}</div>);
            }

            if (!this.state.data) {
                return (<div>Loading...</div>);
            }

            return (
                <WrappedComponent data={this.state.data} {...this.props}/>
            );
        }
    };
};
