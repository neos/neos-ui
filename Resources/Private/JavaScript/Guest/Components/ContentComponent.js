import Component from '@reduct/component';
import PropTypes from '@reduct/nitpick';
import RichText from '../Components/Editors/RichText';

const propTypes = {
    contextPath: PropTypes.isString.isRequired,
    typoScriptPath: PropTypes.isString.isRequired
};

function initializeEditor(el, contentComponent, propertyName, editorClass)  {
    new editorClass(el, contentComponent, propertyName);
}

export default class ContentComponent extends Component {
    constructor(el) {
        super(el, {
            props: {
                contextPath: el.dataset.__cheNodeContextpath,
                typoScriptPath: el.dataset.__cheTyposcriptPath
            },
            propTypes
        });

        if (el.dataset.__cheProperty) {
            initializeEditor(el, this, el.dataset.__cheProperty, RichText);
        }

        [].slice.call(el.querySelectorAll('[data-__che-property]')).forEach(
            el => initializeEditor(el, this, el.dataset.__cheProperty, RichText));
    }

    injectNeosBackendService(neosBackendService) {
        this.neosBackendService = neosBackendService;
    }

    render() {
        this.el.classList.add('guevara/contentComponent');
    }

    isActive() {
        return true;
    }

    commitChange(property, value) {
        this.neosBackendService.documentManager.commitChange(window.name, {
            childNodes: {
                [this.getProp('contextPath')]: {
                    properties: {
                        [property]: value
                    }
                }
            }
        });
    }

    getProperty(property) {
        return this.neosBackendService.documentManager.getConfiguration(window.name)
            .childNodes[this.getProp('contextPath')].properties[property];
    }
}
