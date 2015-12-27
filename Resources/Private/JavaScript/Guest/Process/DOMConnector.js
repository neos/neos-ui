import ContentComponent from '../Components/ContentComponent';
import Oneline from '../Components/Editors/Oneline';
import RichText from '../Components/Editors/RichText';

class DOMConnector {

    constructor(NeosBackend) {
        this.contentComponents = [];
        this.neosBackend = NeosBackend;
    }

    run() {
        [].slice.call(document.querySelectorAll('[data-__neos-access-id]')).forEach(contentElement => {
            const accessId = contentElement.dataset.__neosAccessId;
            const contentComponent = new ContentComponent(contentElement);

            contentComponent.injectNeosBackendService(this.neosBackend);

            this.contentComponents.push(contentComponent);

            if (contentElement.dataset.__neosEditor) {
                if (contentElement.dataset.__neosEditor === 'Oneline')
                    new Oneline(contentElement, contentComponent, contentElement.dataset.__neosProperty);

                if (contentElement.dataset.__neosEditor === 'RichText')
                    new RichText(contentElement, contentComponent, contentElement.dataset.__neosProperty);
            }

            contentComponent.render();
        });
    }

}

export default (NeosBackend, DocumentData) => {
    return new DOMConnector(NeosBackend, DocumentData);
};
