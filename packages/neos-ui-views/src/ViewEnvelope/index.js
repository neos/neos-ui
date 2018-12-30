import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Label from '@neos-project/react-ui-components/src/Label/';
import I18n from '@neos-project/neos-ui-i18n';
import {neos} from '@neos-project/neos-ui-decorators';

@neos(globalRegistry => ({
    viewRegistry: globalRegistry.get('inspector').get('views')
}))
export default class ViewEnvelope extends PureComponent {
    static propTypes = {
        identifier: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        view: PropTypes.string.isRequired,
        options: PropTypes.object,
        renderSecondaryInspector: PropTypes.func,
        viewRegistry: PropTypes.object.isRequired,

        commit: PropTypes.func.isRequired
    };

    generateIdentifier() {
        return `__neos__view---${this.props.identifier}`;
    }

    getViewDefinition() {
        const {view, viewRegistry} = this.props;
        // Support legacy view definitions
        const viewName = view.replace('Content/Inspector/Views', 'Neos.Neos/Inspector/Views');
        return viewRegistry.get(viewName);
    }

    renderViewComponent() {
        const viewDefinition = this.getViewDefinition();

        if (viewDefinition && viewDefinition.component) {
            const ViewComponent = viewDefinition && viewDefinition.component;

            return (
                <ViewComponent
                    {...this.props}
                    />
            );
        }

        return (<div>Missing View {this.props.view}</div>);
    }

    renderLabel() {
        const viewDefinition = this.getViewDefinition();
        if (viewDefinition && viewDefinition.hasOwnLabel) {
            return null;
        }

        const {label} = this.props;

        return (
            <Label htmlFor={this.generateIdentifier()}>
                <I18n id={label}/>
            </Label>
        );
    }

    render() {
        return (
            <div>
                {this.renderLabel()}
                {this.renderViewComponent()}
            </div>
        );
    }
}
