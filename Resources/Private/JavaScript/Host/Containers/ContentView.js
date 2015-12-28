import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import Immutable from 'immutable';
import classNames from 'classnames';

@connect(state => {
	return {
		tabs: state.get('tabs')
	};
})
export default class ContentView extends Component {
	static propTypes = {
		tabs: PropTypes.instanceOf(Immutable.Map)
	};

	render() {
		const {tabs} = this.props;

		return (
			<div className="contentView">
				{tabs.get('byId').map(tab => {
					const tabClasses = classNames({
						'contentView__tab': true,
						'contentView__tab--active': tab.get('id') === tabs.get('active')
					});

					return <iframe src={tab.get('src')} frameBorder="0" name={tab.get('id')} key={tab.get('id')} className={tabClasses} />;
				})}
			</div>
		);
	}

}
