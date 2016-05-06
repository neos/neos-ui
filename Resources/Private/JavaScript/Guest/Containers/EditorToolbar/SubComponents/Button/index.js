import React, {Component, PropTypes} from 'react';

import {IconButton} from 'Components/index';
import {SignalPropType} from 'Guest/Process/SignalRegistry/index';

export default class Button extends Component {
    static propTypes = {
        configuration: PropTypes.shape({
            icon: PropTypes.string.isRequired,
            isActive: PropTypes.bool.isRequired,
            isEnabled: PropTypes.bool.isRequired,
            onClick: SignalPropType.isRequired
        }).isRequired,

        dispatchEditorSignal: PropTypes.func.isRequired
    };

    render() {
        const {dispatchEditorSignal} = this.props;
        const {onClick, isActive, icon} = this.props.configuration;

        return (<IconButton
            onClick={() => dispatchEditorSignal(onClick)}
            isActive={isActive}
            icon={icon}
            hoverStyle="brand"
            />);
    }
}
