import {editors, ContentComponent} from '../Components/';

const {onelineEditor, richTextEditor} = editors;

function closestContextPath(el) {
    if (!el) {
        return null;
    }

    return el.dataset.__cheNodeContextpath || closestContextPath(el.parentNode);
}

class DOMConnector {
  	constructor(NeosBackend) {
    		this.contentComponents = {};
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
            const typoScriptPath = contentElement.dataset.__cheTyposcriptPath;
            const contentComponent = new ContentComponent(contentElement);

      			contentComponent.injectNeosBackendService(this.neosBackend);

      			this.contentComponents[typoScriptPath] = contentComponent;

      			contentComponent.render();
  		  });

        [].slice.call(document.querySelectorAll('[data-__che-property]')).forEach(contentElement => {
            const nodeContextPath = closestContextPath(contentElement);

      			richTextEditor(contentElement);
  		  });
  	}
}

export default (NeosBackend, DocumentData) => new DOMConnector(NeosBackend, DocumentData);
