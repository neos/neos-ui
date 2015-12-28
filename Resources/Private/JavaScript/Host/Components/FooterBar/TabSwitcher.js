import React, {Component, PropTypes} from 'react';
import Immutable from 'immutable';

export default class TopBar extends Component {
	static propTypes = {
		tabs: PropTypes.instanceOf(Immutable.Map),
		active: PropTypes.string,
		onSwitchTab: PropTypes.func
	}

	render() {
		const {tabs, active} = this.props;

		return (
			<div className="bar bar--bottom">
				<div className="tabSwitcher">
					{tabs.map(tab => {
						if (tab.get('id') === active) {
							return (
								<div className="tabSwitcher__tab tabSwitcher__tab--active">
									<span className="tabSwitcher__tab__label">{tab.get('title')}</span>
								</div>
							);
						}

						return (
							<div className="tabSwitcher__tab" onClick={() => this.onClick(tab)}>
								<span className="tabSwitcher__tab__label">{tab.get('title')}</span>
							</div>
						);
					})}
				</div>
			</div>
		);
	}

	onClick(tab) {
		const {onSwitchTab} = this.props;

		onSwitchTab(tab);
	}
}
