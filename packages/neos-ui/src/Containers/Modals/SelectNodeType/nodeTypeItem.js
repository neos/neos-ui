import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';
import mergeClassNames from 'classnames';

import {neos} from '@neos-project/neos-ui-decorators';
import Icon from '@neos-project/react-ui-components/src/Icon/';
import IconButton from '@neos-project/react-ui-components/src/IconButton/';
import Button from '@neos-project/react-ui-components/src/Button/';
import {actions} from '@neos-project/neos-ui-redux-store';
import I18n from '@neos-project/neos-ui-i18n';
import {isNil} from '@neos-project/utils-helpers';

import style from './style.css';

@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))
@connect($transform({
    mode: $get('ui.addNodeModal.mode')
}), {
    closeModal: actions.UI.AddNodeModal.close,
    persistChanges: actions.Changes.persistChanges
})
class NodeTypeItem extends PureComponent {
    static propTypes = {
        focused: PropTypes.bool,
        onSelect: PropTypes.func.isRequired,
        onHelpMessage: PropTypes.func.isRequired,

        nodeType: PropTypes.shape({
            name: PropTypes.string.isRequired,
            ui: PropTypes.object
        }).isRequired,
        groupName: PropTypes.string.isRequired,
        i18nRegistry: PropTypes.object
    };

    /**
     * This method returns the size if the rendered icon.
     * We can render the option icon or preview icon. The size for icon is always "lg".
     *
     * If we have a preview icon option set and no separte previewIconSize option the icon size will be 2x.
     * We allow only the sizes 'xs', 'sm', 'lg', '2x' and '3x'.
     *
     * @returns {string}
     */
    getIconSize() {
        const {previewIconSize, previewIcon} = $get('nodeType.ui', this.props);
        const allowedSizes = ['xs', 'sm', 'lg', '2x', '3x'];
        const size = !isNil(previewIconSize) && allowedSizes.includes(previewIconSize) ? previewIconSize : '2x';
        return isNil(previewIcon) ? 'lg' : size;
    }

    render() {
        const {ui, name} = this.props.nodeType;
        const label = $get('label', ui);
        const usePreviewIcon = ('previewIcon' in ui);
        const icon = $get(usePreviewIcon ? 'previewIcon' : 'icon', ui);
        const size = this.getIconSize();
        const {onHelpMessage, groupName, i18nRegistry, focused} = this.props;
        const helpMessage = i18nRegistry.translate($get('help.message', ui));

        return (
            <div className={style.nodeType}>
                <Button
                    hoverStyle="brand"
                    style="clean"
                    className={mergeClassNames({
                        [style.nodeType__item]: true,
                        [style['nodeType__item--focused']]: focused
                    })}
                    onClick={this.handleNodeTypeClick}
                    title={helpMessage ? helpMessage : ''}
                >
                    <span>
                        <span className={style.nodeType__iconWrapper}>
                            {icon && <Icon icon={icon} size={size} className={style.nodeType__icon} />}
                        </span>
                        <I18n id={label} fallback={label}/>
                    </span>
                </Button>
                {helpMessage ? <IconButton className={style.nodeType__helpIcon} onClick={() => onHelpMessage(name, groupName)} icon="question-circle" /> : null}
            </div>
        );
    }

    handleNodeTypeClick = () => {
        this.props.onSelect(this.props.nodeType.name);
    }
}

export default NodeTypeItem;
