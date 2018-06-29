import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';

import {neos} from '@neos-project/neos-ui-decorators';
import {actions} from '@neos-project/neos-ui-redux-store';
import Dialog from '@neos-project/react-ui-components/src/Dialog/';
import I18n from '@neos-project/neos-ui-i18n';

import style from './style.css';

@neos(globalRegistry => ({
    hotkeyRegistry: globalRegistry.get('hotkeys')
}))
@connect(
    $transform({isOpen: $get('ui.keyboardShortcut.isOpen')}),
    {toggleFullScreen: actions.UI.KeyboardShortcut.toggle}
)
class KeyboardShortcutModal extends Component {
    static propTypes = {
        hotkeyRegistry: PropTypes.object.isRequired,
        isOpen: PropTypes.bool.isRequired,
        toggleFullScreen: PropTypes.func.isRequired
    }

    renderShortcut = ({id, description, keys}) => (
        <div key={id} className={style.keyboardShortcut}>
            <div className={style.keyboardShortcut__label}>
                <I18n id={`Neos.Neos.Ui:Main:Shortcut__${id}`} fallback={description} />
            </div>
            <div className={style.keyboardShortcut__keys}>{keys}</div>
        </div>
    )

    render() {
        const {toggleFullScreen, isOpen, hotkeyRegistry} = this.props;

        return (
            <Dialog
                title={<I18n fallback="Keyboard Shortcuts" />}
                isOpen={isOpen}
                onRequestClose={() => toggleFullScreen()}
                isOpen={true}
                >
                <div className={style.keyboardShortcutIntroText}>
                    <I18n id={`Neos.Neos.Ui:Main:Shortcut__Introduction`} fallback={''} />
                </div>
                <div className={style.keyboardShortcutList}>
                    {hotkeyRegistry.getAllAsList().map(key => this.renderShortcut(key))}
                </div>
            </Dialog>
        );
    }
}

export default KeyboardShortcutModal;
