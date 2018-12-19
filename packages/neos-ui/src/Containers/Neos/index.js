import React, {PureComponent, Children} from 'react';
import PropTypes from 'prop-types';

import {NeosContext} from '@neos-project/neos-ui-decorators';

export default class Neos extends PureComponent {
    static propTypes = {
        globalRegistry: PropTypes.object.isRequired,
        configuration: PropTypes.object.isRequired,
        routes: PropTypes.object.isRequired,
        children: PropTypes.element.isRequired
    };

    render() {
        const {configuration, globalRegistry, routes} = this.props;
        return (
            <NeosContext.Provider value={{configuration, globalRegistry, routes}}>
                {Children.only(this.props.children)}
            </NeosContext.Provider>
        );
    }
}
