import React, {PureComponent, PropTypes} from 'react';

import SelectBox from '@neos-project/react-ui-components/lib/SelectBox/';
import Icon from '@neos-project/react-ui-components/lib/Icon/';

import I18n from '@neos-project/neos-ui-i18n';

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

export default class InsertModeSelector extends PureComponent {
    static propTypes = {
        mode: PropTypes.string,
        enableAlongsideModes: PropTypes.bool.isRequired,
        enableIntoMode: PropTypes.bool.isRequired,
        onSelect: PropTypes.func.isRequired
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

    prepareOptions(props) {
        const {enableAlongsideModes, enableIntoMode} = props;
        this.options = [];

        if (enableAlongsideModes) {
            this.options.push({
                value: MODE_BEFORE,
                label: (
                    <span>
                        <I18n fallback="Insert" id="Neos.Neos.Ui:Main:insert"/>
                        &nbsp;<I18n fallback="before" id="before"/>
                        &nbsp;<Icon icon="level-up"/>
                    </span>
                )
            });
        }

        if (enableIntoMode) {
            this.options.push({
                value: MODE_INTO,
                label: (
                    <span>
                        <I18n fallback="Insert" id="Neos.Neos.Ui:Main:insert"/>
                        &nbsp;<I18n fallback="into" id="into"/>
                        &nbsp;<Icon icon="long-arrow-right"/>
                    </span>
                )
            });
        }

        if (enableAlongsideModes) {
            this.options.push({
                value: MODE_AFTER,
                label: (
                    <span>
                        <I18n fallback="Insert" id="Neos.Neos.Ui:Main:insert"/>
                        &nbsp;<I18n fallback="after" id="after"/>
                        &nbsp;<Icon icon="level-down"/>
                    </span>
                )
            });
        }
    }

    componentWillMount() {
        this.selectPreferredInitialModeIfModeIsEmpty(this.props);
        this.prepareOptions(this.props);
    }

    componentWillReceiveProps(props) {
        this.selectPreferredInitialModeIfModeIsEmpty(props);
        this.prepareOptions(props);
    }

    render() {
        const {mode} = this.props;

        if (!mode) {
            return null;
        }

        return (
            <SelectBox
                options={this.options}
                value={mode}
                onSelect={this.handleSelect}
                />
        );
    }

    handleSelect(mode) {
        const {onSelect} = this.props;

        onSelect(mode);
    }
}
