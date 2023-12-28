import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import {ButtonGroup, Button, Icon} from '@neos-project/react-ui-components';
import {neos} from '@neos-project/neos-ui-decorators';
import I18n from '@neos-project/neos-ui-i18n';

import style from './style.module.css';

const MODE_AFTER = 'after';
const MODE_BEFORE = 'before';
const MODE_INTO = 'into';

//
// In case no mode is provided initially, this function is used to determine,
// which mode should be preselected then.
//
// If the `into` mode is allowed, it should always be preferred.
//
// Otherwise `after` should be preferred, since `before` is a rather exceptional
// choice.
//
const calculatePreferredInitialMode = props => {
    const {enableAlongsideModes, enableIntoMode} = props;

    if (enableIntoMode) {
        return MODE_INTO;
    }

    if (enableAlongsideModes) {
        return MODE_AFTER;
    }

    return null;
};

@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))
export default class InsertModeSelector extends PureComponent {
    static propTypes = {
        mode: PropTypes.string,
        enableAlongsideModes: PropTypes.bool.isRequired,
        enableIntoMode: PropTypes.bool.isRequired,
        onSelect: PropTypes.func.isRequired,

        i18nRegistry: PropTypes.object.isRequired
    };

    options = [];

    selectPreferredInitialModeIfModeIsEmpty(props) {
        const {mode, onSelect} = props;
        let reconsiderMode = !mode;

        if (mode === MODE_INTO && !props.enableIntoMode) {
            reconsiderMode = true;
        }

        if ((mode === MODE_AFTER || mode === MODE_BEFORE) && !props.enableAlongsideModes) {
            reconsiderMode = true;
        }

        if (reconsiderMode) {
            const preferredInitialMode = calculatePreferredInitialMode(props);

            if (preferredInitialMode) {
                onSelect(preferredInitialMode);
            }
        }
    }

    UNSAFE_componentWillMount() {
        this.selectPreferredInitialModeIfModeIsEmpty(this.props);
    }

    UNSAFE_componentWillReceiveProps(props) {
        this.selectPreferredInitialModeIfModeIsEmpty(props);
    }

    render() {
        const {mode, enableIntoMode, enableAlongsideModes, i18nRegistry} = this.props;

        if (!mode) {
            return null;
        }

        return (
            <div className={style.root}>
                <span className={style.label}>
                    <I18n id="Neos.Neos:Main:insertMode"/>&nbsp;
                </span>
                <ButtonGroup value={mode} onSelect={this.handleSelect} className={style.buttonGroup}>
                    <Button
                        id={MODE_BEFORE}
                        disabled={!enableAlongsideModes}
                        style="lighter"
                        size="small"
                        title={`${i18nRegistry.translate('Neos.Neos:Main:insert')} ${i18nRegistry.translate('above')}`}
                    >
                        <Icon icon="resource://Neos.Neos.Ui/Icons/create-above.svg" className={style.iconAlignment} size="1x"/>
                        <I18n id="Neos.Neos.Ui:Main:above" fallback="Above"/>
                    </Button>
                    <Button
                        id={MODE_AFTER}
                        className={style.afterButton}
                        disabled={!enableAlongsideModes}
                        style="lighter"
                        size="small"
                        title={`${i18nRegistry.translate('Neos.Neos:Main:insert')} ${i18nRegistry.translate('below')}`}
                    >
                        <Icon icon="resource://Neos.Neos.Ui/Icons/create-below.svg" className={style.iconAlignment} size="1x"/>
                        <I18n id="Neos.Neos.Ui:Main:below" fallback="Below"/>
                    </Button>
                    <Button
                        id={MODE_INTO}
                        className={style.intoButton}
                        disabled={!enableIntoMode}
                        style="lighter"
                        size="small"
                        title={`${i18nRegistry.translate('Neos.Neos:Main:insert')} ${i18nRegistry.translate('into')}`}
                    >
                        <Icon icon="resource://Neos.Neos.Ui/Icons/create-inside.svg" className={style.iconAlignment} size="1x"/>
                        <I18n id="Neos.Neos.Ui:Main:inside" fallback="Inside"/>
                    </Button>
                </ButtonGroup>
            </div>
        );
    }

    handleSelect = mode => {
        const {onSelect} = this.props;

        onSelect(mode);
    }
}
