import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {neos} from '@neos-project/neos-ui-decorators';
import {actions} from '@neos-project/neos-ui-redux-store';
import {translate} from '@neos-project/neos-ui-i18n';

import {Dialog, Button} from '@neos-project/react-ui-components';
import style from './style.module.css';

@neos(globalRegistry => ({
    hotkeyRegistry: globalRegistry.get('hotkeys')
}))
@connect(
    state => ({isOpen: state?.ui?.keyboardShortcutModal?.isOpen}),
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
                {translate(`Neos.Neos.Ui:Main:Shortcut__${id}`, description)}
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
                {translate('Neos.Neos.Ui:Main:close', 'Close')}
            </Button>
        );
    }

    render() {
        const {close, isOpen, hotkeyRegistry} = this.props;

        return (
            <Dialog
                actions={[this.renderCloseAction()]}
                title="Keyboard Shortcuts"
                isOpen={isOpen}
                onRequestClose={() => close()}
                >
                <div className={style.keyboardShortcutIntroText}>
                    {translate('Neos.Neos.Ui:Main:Shortcut__Introduction')}
                </div>
                <div className={style.keyboardShortcutList}>
                    {hotkeyRegistry.getAllAsList().map(key => this.renderShortcut(key))}
                </div>
            </Dialog>
        );
    }
}

export default KeyboardShortcutModal;
