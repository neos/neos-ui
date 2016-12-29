import React, {PureComponent, PropTypes} from 'react';

import ButtonGroup from '@neos-project/react-ui-components/lib/ButtonGroup/';
import IconButton from '@neos-project/react-ui-components/lib/IconButton/';

import {neos} from '@neos-project/neos-ui-decorators';
import {i18nService} from '@neos-project/neos-ui-i18n';

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

@neos()
export default class InsertModeSelector extends PureComponent {
    static propTypes = {
        mode: PropTypes.string,
        enableAlongsideModes: PropTypes.bool.isRequired,
        enableIntoMode: PropTypes.bool.isRequired,
        onSelect: PropTypes.func.isRequired,
        translations: PropTypes.object.isRequired
    };

    constructor(...args) {
        super(...args);

        this.handleSelect = this.handleSelect.bind(this);
        this.options = [];
    }

    selectPreferredInitialModeIfModeIsEmpty(props) {
        const {mode, onSelect} = props;

        if (!mode) {
            const preferredInitialMode = calculatePreferredInitialMode(props);

            if (preferredInitialMode) {
                onSelect(preferredInitialMode);
            }
        }
    }

    componentWillMount() {
        this.selectPreferredInitialModeIfModeIsEmpty(this.props);
    }

    componentWillReceiveProps(props) {
        this.selectPreferredInitialModeIfModeIsEmpty(props);
    }

    render() {
        const {mode, enableIntoMode, enableAlongsideModes, translations} = this.props;
        const translate = i18nService(translations);

        if (!mode) {
            return null;
        }

        return (
            <ButtonGroup value={mode} onSelect={this.handleSelect}>
                <IconButton
                    id={MODE_BEFORE}
                    isDisabled={!enableAlongsideModes}
                    style="lighter"
                    icon="level-up"
                    title={`${translate('Neos.Neos.Ui:Main:insert')} ${translate('before')}`}
                    />
                <IconButton
                    id={MODE_INTO}
                    isDisabled={!enableIntoMode}
                    style="lighter"
                    icon="long-arrow-right"
                    title={`${translate('Neos.Neos.Ui:Main:insert')} ${translate('into')}`}
                    />
                <IconButton
                    id={MODE_AFTER}
                    isDisabled={!enableAlongsideModes}
                    style="lighter"
                    icon="level-down"
                    title={`${translate('Neos.Neos.Ui:Main:insert')} ${translate('after')}`}
                    />
            </ButtonGroup>
        );
    }

    handleSelect(mode) {
        const {onSelect} = this.props;

        onSelect(mode);
    }
}
