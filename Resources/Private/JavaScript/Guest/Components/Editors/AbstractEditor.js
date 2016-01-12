import Component from '@reduct/component';
import {backend} from 'Guest/Service/';
import debounce from 'lodash.debounce';

export class AbstractEditor extends Component {
    constructor(el, property, contextPath, options = {}) {
        super(el, options);

        this.property = property;
        this.contextPath = contextPath;
        this.initializeEvents();

        this.handleKeyStroke = this.handleKeyStroke.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.commenceCommit = debounce(this.commenceCommit.bind(this), 300);

        this.__storedElement = null;
    }

    initializeEvents() {
        this.el.addEventListener('click', () => this.commenceThaw());
    }

    hasChanges() {
        return false;
    }

    commenceThaw() {
        this.__storedElement = this.el;
        this.el = this.thaw(this.__storedElement, this.el.innerHTML);

        this.__storedElement.parentNode.replaceChild(this.el, this.__storedElement);

        setTimeout(() => {
            document.addEventListener('keydown', this.handleKeyStroke);
            document.addEventListener('click', this.handleOutsideClick);
            this.editorDidMount();
        }, 0);
    }

    handleKeyStroke(e) {
        if (e.keyCode === 27) {
            this.commenceAbort();
            return;
        }

        this.commenceCommit();
    }

    handleOutsideClick(e) {
        const check = el => el === this.el || (el && check(el.parentNode));

        setTimeout(() => {
            if (!check(e.target)) {
                this.commenceCommit();
                this.commenceFreeze();
            }
        }, 0);
    }

    commenceCommit() {
        const {changeManager} = backend;

        if (this.hasChanges()) {
            changeManager.commitChange({
                type: 'PackageFactory.Guevara:Property',
                subject: this.contextPath,
                payload: {
                    propertyName: this.property,
                    value: this.commit()
                }
            });
        }
    }

    commenceAbort() {
        this.commenceFreeze();
    }

    commenceFreeze() {
        const el = this.freeze(this.__storedElement);

        this.el.parentNode.replaceChild(el, this.el);
        this.__storedElement = null;
        this.el = el;

        document.removeEventListener('keydown', this.commenceCommit);
        document.removeEventListener('click', this.handleOutsideClick);
    }
}

export default AbstractEditor;
