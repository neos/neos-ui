import {editors, ContentComponent} from '../Components/';

const {onelineEditor, richTextEditor} = editors;

class DOMConnector {
  	constructor(NeosBackend) {
    		this.contentComponents = [];
    		this.neosBackend = NeosBackend;
  	}

    run() {
        [].slice.call(document.querySelectorAll('a[href]')).forEach((link) => {
            link.draggable = true;

            link.ondragstart = (e) => {
                e.dataTransfer.setData('href', link.href);
            };
        });

        [].slice.call(document.querySelectorAll('[data-__che-node-contextpath]')).forEach(contentElement => {
            const nodeContextPath = contentElement.dataset.__cheNodeContextpath;
            const typoScriptPath = contentElement.dataset.__cheTyposcriptPath;
            const contentComponent = new ContentComponent(contentElement);

      			contentComponent.injectNeosBackendService(this.neosBackend);

      			this.contentComponents.push(contentComponent);

      			contentComponent.render();
  		  });
  	}
}

export default (NeosBackend, DocumentData) => new DOMConnector(NeosBackend, DocumentData);
