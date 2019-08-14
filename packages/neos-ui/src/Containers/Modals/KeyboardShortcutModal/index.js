import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';

import {neos} from '@neos-project/neos-ui-decorators';
import {actions} from '@neos-project/neos-ui-redux-store';
import Dialog from '@neos-project/react-ui-components/src/Dialog/';
import I18n from '@neos-project/neos-ui-i18n';
import Button from '@neos-project/react-ui-components/src/Button/';

import style from './style.css';

@neos(globalRegistry => ({
    hotkeyRegistry: globalRegistry.get('hotkeys')
}))
@connect(
    $transform({isOpen: $get('ui.keyboardShortcutModal.isOpen')}),
    {close: actions.UI.KeyboardShortcutModal.close}
)
class KeyboardShortcutModal extends PureComponent {
    static propTypes = {
        hotkeyRegistry: PropTypes.object.isRequired,
        isOpen: PropTypes.bool.isRequired,
        close: PropTypes.func.isRequired
    }

    renderShortcut = ({id, description, keys}) => (
        <div key={id} className={style.keyboardShortcut}>
            <div className={style.keyboardShortcut__label}>
                <I18n id={`Neos.Neos.Ui:Main:Shortcut__${id}`} fallback={description} />
            </div>
            <div className={style.keyboardShortcut__keys}>{keys}</div>
        </div>
    )

    renderCloseAction() {
        return (
            <Button
                id="neos-KeyboardShortcutModal-Close"
                key="close"
                style="lighter"
                hoverStyle="brand"
                onClick={() => this.props.close()}
                >
                <I18n id="Neos.Neos:Main:close" fallback="Close"/>
            </Button>
        );
    }

    render() {
        const {close, isOpen, hotkeyRegistry} = this.props;

        return (
            <Dialog
                actions={[this.renderCloseAction()]}
                title={<I18n fallback="Keyboard Shortcuts" />}
                isOpen={isOpen}
                onRequestClose={() => close()}
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
