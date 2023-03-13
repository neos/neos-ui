import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import ButtonGroup from '@neos-project/react-ui-components/src/ButtonGroup/';
import Button from '@neos-project/react-ui-components/src/Button/';
import Icon from '@neos-project/react-ui-components/src/Icon/';

import {neos} from '@neos-project/neos-ui-decorators';
import I18n from '@neos-project/neos-ui-i18n';

import style from './style.module.css';
import {GlobalRegistry} from '@neos-project/neos-ts-interfaces';

type InsertMode = 'after' | 'before' | 'into'

type InsertModeSelectorOwnProps = {
    mode?: InsertMode
    enableAlongsideModes: boolean
    enableIntoMode: boolean
    onSelect: (mode: InsertMode) => string
}

type InjectedNeosProps = ReturnType<typeof injectNeosProps>

type InsertModeSelectorProps = InsertModeSelectorOwnProps & InjectedNeosProps

const MODE_AFTER = 'after';
const MODE_BEFORE = 'before';
const MODE_INTO = 'into';

//
// In case no mode is provided initially, this function is used to determine,
// which mode should be preselected then.
//
// If the `into` mode is allowed, it should always be preferred.
//
// Otherwise, `after` should be preferred since `before` is a rather exceptional
// choice.
//
const calculatePreferredInitialMode = (props: InsertModeSelectorProps) => {
    const {enableAlongsideModes, enableIntoMode} = props;

    if (enableIntoMode) {
        return MODE_INTO;
    }

    if (enableAlongsideModes) {
        return MODE_AFTER;
    }

    return null;
};

const injectNeosProps = (globalRegistry: GlobalRegistry) => ({
    i18nRegistry: globalRegistry.get('i18n')
})

// @ts-ignore -- NeosDecorator typings do not work for now.
// Error: Property 'propTypes' is missing in type 'typeof NeosDecorator' but required in type 'typeof InsertModeSelector'.
@neos<InsertModeSelectorOwnProps, InjectedNeosProps>(injectNeosProps)
export default class InsertModeSelector extends PureComponent<InsertModeSelectorProps> {
    static propTypes = {
        mode: PropTypes.oneOf([MODE_AFTER, MODE_BEFORE, MODE_INTO]),
        enableAlongsideModes: PropTypes.bool.isRequired,
        enableIntoMode: PropTypes.bool.isRequired,
        onSelect: PropTypes.func.isRequired,
        // injected neos props
        i18nRegistry: PropTypes.object.isRequired
    };

    selectPreferredInitialModeIfModeIsEmpty(props: InsertModeSelectorProps) {
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

    UNSAFE_componentWillReceiveProps(props: InsertModeSelectorProps) {
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
                        <Icon icon="level-up-alt" size="1x"/>
                        <I18n id="Neos.Neos.Ui:Main:above" fallback="Above"/>
                    </Button>
                    <Button
                        id={MODE_AFTER}
                        disabled={!enableAlongsideModes}
                        style="lighter"
                        size="small"
                        title={`${i18nRegistry.translate('Neos.Neos:Main:insert')} ${i18nRegistry.translate('below')}`}
                    >
                        <Icon icon="level-down-alt" size="1x"/>
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
                        <Icon icon="sign-in-alt" size="1x"/>
                        <I18n id="Neos.Neos.Ui:Main:inside" fallback="Inside"/>
                    </Button>
                </ButtonGroup>
            </div>
        );
    }

    handleSelect = (mode: InsertMode) => {
        const {onSelect} = this.props;

        onSelect(mode);
    }
}
