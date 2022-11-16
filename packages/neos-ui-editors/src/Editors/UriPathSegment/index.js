import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import unescape from 'lodash.unescape';
import backend from '@neos-project/neos-ui-backend-connector';
import {neos} from '@neos-project/neos-ui-decorators';
import {selectors} from '@neos-project/neos-ui-redux-store';
import {TextInput, IconButton} from '@neos-project/react-ui-components';
import style from './style.css';

const defaultOptions = {
    autoFocus: false,
    disabled: false,
    maxlength: null,
    readonly: false
};

const busySyncIconProps = {
    spin: true
};

@connect(state => ({
    nodeContextPath: selectors.CR.Nodes.focusedNodePathSelector(state)
}))
@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))
export default class UriPathSegment extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        commit: PropTypes.func.isRequired,
        options: PropTypes.object,
        onKeyPress: PropTypes.func,
        onEnterKey: PropTypes.func,
        id: PropTypes.string,
        nodeContextPath: PropTypes.string,

        i18nRegistry: PropTypes.object.isRequired
    };

    static defaultProps = {
        options: {}
    };

    state = {
        isBusy: false
    };

    generatePathSegment = async () => {
        const {
            commit,
            options,
            nodeContextPath
        } = this.props;
        const titleValue = options && options.title ? options.title : '';

        const {generateUriPathSegment} = backend.get().endpoints;

        this.setState({isBusy: true});
        try {
            const slug = await generateUriPathSegment(nodeContextPath, titleValue);
            commit(slug);
        } finally {
            this.setState({isBusy: false});
        }
    }

    render() {
        const {
            id,
            value,
            className,
            commit,
            options,
            i18nRegistry,
            onKeyPress,
            onEnterKey
        } = this.props;

        // Placeholder text must be unescaped in case html entities were used
        const placeholder =
            options &&
            options.placeholder &&
            i18nRegistry.translate(unescape(options.placeholder));
        const finalOptions = Object.assign({}, defaultOptions, options);

        const showSyncButton = !(
            finalOptions.readonly || finalOptions.disabled
        );

        return (
            <div style={{display: 'flex'}} className={className}>
                <div style={{flexGrow: 1}}>
                    <TextInput
                        id={id}
                        autoFocus={finalOptions.autoFocus}
                        value={value}
                        onChange={commit}
                        placeholder={placeholder}
                        onKeyPress={onKeyPress}
                        onEnterKey={onEnterKey}
                        disabled={finalOptions.disabled || this.state.isBusy}
                        maxLength={finalOptions.maxlength}
                        readOnly={finalOptions.readonly}
                    />
                </div>
                {showSyncButton ? (
                    <div style={{flexGrow: 0}}>
                        <IconButton
                            id="neos-UriPathSegmentEditor-sync"
                            size="regular"
                            icon="sync"
                            iconProps={this.state.isBusy ? busySyncIconProps : undefined}
                            onClick={this.generatePathSegment}
                            className={style.syncButton}
                            disabled={this.state.isBusy}
                            style="neutral"
                            hoverStyle="clean"
                            title={i18nRegistry.translate(
                                'Neos.Neos.Ui:Main:syncUriPathSegment'
                            )}
                        />
                    </div>
                ) : null}
            </div>
        );
    }
}
