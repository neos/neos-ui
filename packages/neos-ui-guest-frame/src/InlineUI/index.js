import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';
import {actions, selectors} from '@neos-project/neos-ui-redux-store';

import NodeToolbar from './NodeToolbar/index';

import style from './style.css';

@connect($transform({
    focused: $get('cr.nodes.focused'),
    shouldScrollIntoView: selectors.UI.ContentCanvas.shouldScrollIntoView
}), {
    requestScrollIntoView: actions.UI.ContentCanvas.requestScrollIntoView
})
export default class InlineUI extends PureComponent {
    static propTypes = {
        focused: PropTypes.object,
        requestScrollIntoView: PropTypes.func.isRequired,
        shouldScrollIntoView: PropTypes.bool.isRequired
    };

    render() {
        const focused = this.props.focused.toJS();
        const {shouldScrollIntoView, requestScrollIntoView} = this.props;

        return (
            <div className={style.inlineUi} data-__neos__inlineUI="TRUE">
                <NodeToolbar
                    shouldScrollIntoView={shouldScrollIntoView}
                    requestScrollIntoView={requestScrollIntoView}
                    {...focused}
                    />
            </div>
        );
    }
}
