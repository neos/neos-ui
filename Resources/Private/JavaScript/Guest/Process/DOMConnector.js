import {editors, ContentComponent} from '../Components/';

const {onelineEditor, richTextEditor} = editors;

class DOMConnector {
	constructor(NeosBackend) {
		this.contentComponents = [];
		this.neosBackend = NeosBackend;
	}

	run() {
		[].slice.call(document.querySelectorAll('[data-__neos-access-id]')).forEach(contentElement => {
			const contentComponent = new ContentComponent(contentElement);

			contentComponent.injectNeosBackendService(this.neosBackend);

			this.contentComponents.push(contentComponent);

			if (contentElement.dataset.__neosEditor) {
				switch (contentElement.dataset.__neosEditor) {
					case 'Oneline':
						onelineEditor(contentElement, contentComponent, contentElement.dataset.__neosProperty);
						break;

					case 'RichText':
						richTextEditor(contentElement, contentComponent, contentElement.dataset.__neosProperty);
						break;

					default:
						break;
				}
			}

			contentComponent.render();
		});
	}
}

export default (NeosBackend, DocumentData) => new DOMConnector(NeosBackend, DocumentData);
