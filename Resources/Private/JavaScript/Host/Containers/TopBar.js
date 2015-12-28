import React, {Component} from 'react';
import {connect} from 'react-redux';

@connect()
export default class TopBar extends Component {
	render() {
		return (
			<div className="bar bar--top">
				<div style={{lineHeight: '41px', paddingLeft: '1em'}}>I-Frame Example</div>
			</div>
		);
	}
}
