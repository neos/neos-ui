import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {neos} from '@neos-project/neos-ui-decorators';

@neos(globalRegistry => ({
    containerRegistry: globalRegistry.get('containers')
}))
export default class Modals extends PureComponent {
    static propTypes = {
        containerRegistry: PropTypes.object.isRequired
    };

    render() {
        const {containerRegistry} = this.props;

        const modals = containerRegistry.getChildren('Modals');

        return (
            <div>
                {modals.map((Component, key) => <Component key={key} />)}
            </div>
        );
    }
}
