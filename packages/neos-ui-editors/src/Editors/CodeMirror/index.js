import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {$get} from 'plow-js';

import Button from '@neos-project/react-ui-components/src/Button/';
import Icon from '@neos-project/react-ui-components/src/Icon/';
import Label from '@neos-project/react-ui-components/src/Label/';
import I18n from '@neos-project/neos-ui-i18n';
import {neos} from '@neos-project/neos-ui-decorators';

import style from './style.css';

@neos(globalRegistry => ({
    secondaryEditorsRegistry: globalRegistry.get('inspector').get('secondaryEditors')
}))
export default class CodeMirror extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        identifier: PropTypes.string.isRequired,
        renderSecondaryInspector: PropTypes.func.isRequired,
        commit: PropTypes.func.isRequired,
        label: PropTypes.string.isRequired,
        highlightingMode: PropTypes.string,
        value: PropTypes.string,
        secondaryEditorsRegistry: PropTypes.object.isRequired,
        options: PropTypes.object
    };

    static defaultProps = {
        highlightingMode: 'htmlmixed'
    };

    render() {
        const {label, identifier, className} = this.props;
        const disabled = $get('options.disabled', this.props);
        const handleClick = () => disabled ? null : this.handleOpenCodeEditor;

        return (
            <div>
                <Label className={style.codemirror__label} htmlFor={identifier}>
                    <Button className={className} disabled={disabled} onClick={handleClick()}>
                        <Icon icon="pencil" padded="right" style="lighter" title="Edit"/>
                        <I18n id={label}/>
                    </Button>
                </Label>
            </div>
        );
    }

    handleChange = newValue => {
        this.props.commit(newValue);
    }

    handleOpenCodeEditor = () => {
        const {secondaryEditorsRegistry} = this.props;
        const {component: CodeMirrorWrap} = secondaryEditorsRegistry.get('Neos.Neos/Inspector/Secondary/Editors/CodeMirrorWrap');

        this.props.renderSecondaryInspector('CODEMIRROR_EDIT', () =>
            <CodeMirrorWrap onChange={this.handleChange} value={this.props.value} highlightingMode={this.props.highlightingMode}/>
        );
    }
}
