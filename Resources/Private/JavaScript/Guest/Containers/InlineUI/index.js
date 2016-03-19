import React, {Component, PropTypes} from 'react';

import NodeToolbar from '../NodeToolbar/index';

import style from './style.css';

export default class InlineUI extends Component {
    static propTypes = {
        ui: PropTypes.object.isRequired,
        connection: PropTypes.object.isRequired
    };

    render() {
        const {ui, connection} = this.props;
        const elements = connection.get('ui.inline.elements');

        return (
            <div className={style.inlineUi}>
                <NodeToolbar ui={ui} connection={connection} />
                {elements.map(Component => <Component ui={ui} connection={connection} />)}
            </div>
        );
    }
}
