import Component from '@reduct/component';
import PropTypes from '@reduct/nitpick';

const propTypes = {
    contextPath: PropTypes.isString.isRequired,
    typoScriptPath: PropTypes.isString.isRequired
};

export default class ContentComponent extends Component {
    constructor(el) {
        super(el, {
            props: {
                contextPath: el.dataset.__cheNodeContextpath,
                typoScriptPath: el.dataset.__cheTyposcriptPath
            },
            propTypes
        });
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
