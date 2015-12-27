import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import classNames from 'classnames';

@connect(state => {
    return {
    };
})
export default class TopBar extends Component {

    render() {
        return <div className="bar bar--top">
            <div style={{lineHeight: '41px', paddingLeft: '1em'}}>I-Frame Example</div>
        </div>;
    }

}
