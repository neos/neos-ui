import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import IconButton from '@neos-project/react-ui-components/src/IconButton/';
import {neos} from '@neos-project/neos-ui-decorators';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';
import {actions} from '@neos-project/neos-ui-redux-store';

@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n'),
    hotkeyRegistry: globalRegistry.get('hotkeys')
}))
@connect(
    $transform({isOpen: $get('ui.keyboardShortcutModal.isOpen')}),
    {open: actions.UI.KeyboardShortcutModal.open}
)
export default class KeyboardShortcutButton extends PureComponent {
    static propTypes = {
        i18nRegistry: PropTypes.object.isRequired,
        toggleFullScreen: PropTypes.func,
        hotkeyRegistry: PropTypes.object.isRequired
    };

    render() {
        const {i18nRegistry, open, hotkeyRegistry} = this.props;

        if (hotkeyRegistry._registry === null || hotkeyRegistry._registry.length === 0) {
            return null;
        }

        return (
            <IconButton
                icon="keyboard"
                aria-label={i18nRegistry.translate('Neos.Neos:Main:displayKeyboardShortcuts', 'Display Keyboard Shortcuts')}
                title={i18nRegistry.translate('Neos.Neos:Main:displayKeyboardShortcuts', 'Display Keyboard Shortcuts')}
                onClick={open}
                />
        );
    }
}
