import {DropDown, CheckBox, Button} from '@neos-project/react-ui-components';
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';

import {selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';
import {executeCommand} from './../ckEditorApi';
import ckeIcons from './icons';

import style from './TableDropDown.css';

@connect($transform({
    formattingUnderCursor: selectors.UI.ContentCanvas.formattingUnderCursor
}))
@neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository'),
    i18nRegistry: globalRegistry.get('i18n'),
    toolbarRegistry: globalRegistry.get('ckEditor5').get('richtextToolbar')
}))

export default class TableDropDownButton extends PureComponent {
    static propTypes = {
        // The Registry ID/Key of the Style-Select component itself.
        id: PropTypes.string.isRequired,

        options: PropTypes.array,
        formattingUnderCursor: PropTypes.objectOf(PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.bool,
            PropTypes.string,
            PropTypes.object
        ])),

        i18nRegistry: PropTypes.object.isRequired
    };

    state = {
        isOpen: false
    };

    handleClick = commandName => {
        executeCommand(commandName);
        this.setState({isOpen: false});
    }

    render() {
        return (
            <DropDown
                padded={false}
            >
                <DropDown.Header title={this.props.i18nRegistry.translate(this.props.tooltip)}>
                    <img style={{verticalAlign: 'text-top'}} src={ckeIcons[this.props.icon]} alt={this.props.i18nRegistry.translate(this.props.tooltip)} />
                </DropDown.Header>
                <DropDown.Contents className={style.contents} scrollable={false}>
                    {this.props.options.map(item => item.type === 'checkBox' ? (
                        <label
                            key={item.commandName}
                            className={style.checkBox}
                            onClick={() => this.handleClick(item.commandName)}
                            >
                            <CheckBox isChecked={$get(item.commandName, this.props.formattingUnderCursor)} />
                            {this.props.i18nRegistry.translate(item.label)}
                        </label>
                    ) : (
                        <Button
                            key={item.commandName}
                            style="transparent"
                            onClick={() => this.handleClick(item.commandName)}
                            className={style.button}
                            >
                            {this.props.i18nRegistry.translate(item.label)}
                        </Button>
                    ))}
                </DropDown.Contents>
            </DropDown>
        );
    }
}
