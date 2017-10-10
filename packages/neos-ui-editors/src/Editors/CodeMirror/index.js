import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import Button from '@neos-project/react-ui-components/src/Button/';
import Icon from '@neos-project/react-ui-components/src/Icon/';
import Label from '@neos-project/react-ui-components/src/Label/';
import I18n from '@neos-project/neos-ui-i18n';

import {neos} from '@neos-project/neos-ui-decorators';

@neos(globalRegistry => ({
    secondaryEditorsRegistry: globalRegistry.get('inspector').get('secondaryEditors')
}))
export default class CodeMirror extends PureComponent {
    static propTypes = {
        identifier: PropTypes.string.isRequired,
        renderSecondaryInspector: PropTypes.func.isRequired,
        commit: PropTypes.func.isRequired,
        label: PropTypes.string.isRequired,
        highlightingMode: PropTypes.string,
        value: PropTypes.string,
        secondaryEditorsRegistry: PropTypes.object.isRequired
    };

    static defaultProps = {
        highlightingMode: 'htmlmixed'
    };

    constructor(props) {
        super(props);
        this.handleOpenCodeEditor = this.handleOpenCodeEditor.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const {label, identifier} = this.props;

        return (
            <div>
                <Label htmlFor={identifier}>
                    <Button onClick={this.handleOpenCodeEditor} style="brand">
                        <Icon icon="pencil" padded="right" style="lighter" title="Edit"/>
                        <I18n id={label}/>
                    </Button>
                </Label>
            </div>
        );
    }

    handleChange(newValue) {
        this.props.commit(newValue);
    }

    handleOpenCodeEditor() {
        const {secondaryEditorsRegistry} = this.props;
        const {component: CodeMirrorWrap} = secondaryEditorsRegistry.get('Neos.Neos/Inspector/Secondary/Editors/CodeMirrorWrap');

        this.props.renderSecondaryInspector('CODEMIRROR_EDIT', () =>
            <CodeMirrorWrap onChange={this.handleChange} value={this.props.value} highlightingMode={this.props.highlightingMode}/>
        );
    }
}
