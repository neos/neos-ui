import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$get, $transform} from 'plow-js';
import backend from '@neos-project/neos-ui-backend-connector';
import {actions} from '@neos-project/neos-ui-redux-store';

export default () => WrappedComponent => {
    @connect($transform({
        siteNodeContextPath: $get('cr.nodes.siteNode')
    }), {
        handleServerFeedback: actions.ServerFeedback.handleServerFeedback
    })
    class CreateNew extends PureComponent {
        static propTypes = {
            commit: PropTypes.func.isRequired,
            displayLoadingIndicator: PropTypes.bool,
            handleServerFeedback: PropTypes.func.isRequired,
            options: PropTypes.shape({
                createNewPath: PropTypes.string.isRequired,
                createNewType: PropTypes.string.isRequired,
                createNewTitleProperty: PropTypes.string
            })
        };

        state = {
            isLoading: false
        };

        handleCreateNew = async title => {
            this.setState({isLoading: true});

            const {change} = backend.get().endpoints;

            const data = {};
            const titleProperty = this.props.options.createNewTitleProperty || 'title';
            data[titleProperty] = title;

            const contextString = this.props.siteNodeContextPath.split('@')[1];
            const subject = `${this.props.options.createNewPath}@${contextString}`;

            const response = await change([{
                type: 'Neos.Neos.Ui:CreateInto',
                subject,
                payload: {
                    nodeType: this.props.options.createNewType,
                    data
                }
            }]);

            // Filter out NodeCreated feedback, as we don't want to be redirected
            const feedbacks = response.feedbacks.filter(feedback => feedback.type !== 'Neos.Neos.Ui:NodeCreated');
            this.props.handleServerFeedback({feedbacks});
            const nodeCreatedFeedback = response.feedbacks.find(item => item.type === 'Neos.Neos.Ui:NodeCreated');
            const identifier = $get('payload.identifier', nodeCreatedFeedback);

            const value = Array.isArray(this.props.value) ? this.props.value.concat(identifier) : identifier;
            this.props.commit(value);

            this.setState({isLoading: false});
        }

        render() {
            const onCreateNew = this.props.options.createNewType && this.props.options.createNewPath ? this.handleCreateNew : null;
            return (
                <WrappedComponent
                    {...this.props}
                    onCreateNew={onCreateNew}
                    displayLoadingIndicator={this.state.isLoading || this.props.displayLoadingIndicator}
                    />
            );
        }
    }
    return CreateNew;
};
