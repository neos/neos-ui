import Component from '@reduct/component';
import PropTypes from '@reduct/nitpick';

const propTypes = {
	accessId: PropTypes.isString.isRequired
};

export default class ContentComponent extends Component {
	constructor(el) {
		super(el, {
			props: {
				accessId: el.dataset.__neosAccessId
			},
			propTypes
		});
	}

	injectNeosBackendService(neosBackendService) {
		this.neosBackendService = neosBackendService;
	}

	render() {
		this.el.classList.add('neos/contentComponent');
	}

	isActive() {
		return true;
	}

	commitChange(property, value) {
		this.neosBackendService.documentManager.commitChange(window.name, {
			childNodes: {
				[this.getProp('accessId')]: {
					properties: {
						[property]: value
					}
				}
			}
		});
	}

	getProperty(property) {
		return this.neosBackendService.documentManager.getConfiguration(window.name)
			.childNodes[this.getProp('accessId')].properties[property];
	}
}
