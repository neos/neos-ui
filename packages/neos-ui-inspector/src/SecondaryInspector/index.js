import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Portal} from 'react-portal';
import mergeClassNames from 'classnames';
import {$get} from 'plow-js';

import {selectors} from '@neos-project/neos-ui-redux-store';

import Icon from '@neos-project/react-ui-components/src/Icon/';
import Button from '@neos-project/react-ui-components/src/Button/';

import style from './style.css';

@connect(state => {
    const isDirty = selectors.UI.Inspector.isDirty(state);
    const shouldPromptToHandleUnappliedChanges = selectors.UI.Inspector.shouldPromptToHandleUnappliedChanges(state);
    const unappliedChangesOverlayIsVisible = isDirty && !shouldPromptToHandleUnappliedChanges;

    return {
        isFringeLeft: $get('ui.leftSideBar.isHidden', state),
        isFringeRight: $get('ui.rightSideBar.isHidden', state),
        isFullScreen: $get('ui.fullScreen.isFullScreen', state),
        unappliedChangesOverlayIsVisible
    };
})
export default class SecondaryInspector extends PureComponent {
    static propTypes = {
        isFringeLeft: PropTypes.bool.isRequired,
        isFringeRight: PropTypes.bool.isRequired,
        unappliedChangesOverlayIsVisible: PropTypes.bool.isRequired,

        // Interaction related propTypes.
        onClose: PropTypes.func.isRequired,
        children: PropTypes.element.isRequired
    };

    render() {
        const {
            onClose,
            children,
            isFringeLeft,
            isFringeRight,
            unappliedChangesOverlayIsVisible
        } = this.props;
        const finalClassName = mergeClassNames({
            [style.secondaryInspector]: true,
            [style['secondaryInspector--isFringeLeft']]: isFringeLeft,
            [style['secondaryInspector--isFringeRight']]: isFringeRight,
            [style['secondaryInspector--isElevated']]: unappliedChangesOverlayIsVisible
        });

        return (
            <Portal>
                <div className={finalClassName}>
                    <Button
                        style="clean"
                        className={style.close}
                        onClick={onClose}
                        >
                        <Icon icon="times"/>
                    </Button>
                    {children}
                </div>
            </Portal>
        );
    }
}
