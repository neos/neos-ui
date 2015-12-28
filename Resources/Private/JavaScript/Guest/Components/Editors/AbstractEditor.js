import Component from '@reduct/component';

export class AbstractEditor extends Component {
    constructor(el, owner, property, options = {}) {
        super(el, options);

        this.owner = owner;
        this.property = property;
        this.initializeEvents();

        this.handleKeyStroke = this.handleKeyStroke.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);

        this.__storedElement = null;
    }

    initializeEvents() {
        this.el.addEventListener('click', () => this.commenceThaw());
    }

    commenceThaw() {
        if (this.owner.isActive()) {
            this.__storedElement = this.el;
            this.el = this.thaw(this.__storedElement, this.el.innerHTML);

            this.__storedElement.parentNode.replaceChild(this.el, this.__storedElement);

            setTimeout(() => {
                document.addEventListener('keydown', this.handleKeyStroke);
                document.addEventListener('click', this.handleOutsideClick);
                this.editorDidMount();
            }, 0);
        }
    }

    handleKeyStroke(e) {
        if (e.keyCode === 27) {
            this.commenceAbort();
            return;
        }
    }

    handleOutsideClick(e) {
        const check = el => el === this.el || (el && check(el.parentNode));

        setTimeout(() => {
            if (!check(e.target)) {
                this.commenceCommit();
            }
        }, 0);
    }

    commenceCommit() {
        this.owner.commitChange(this.property, this.commit());
        document.removeEventListener('keydown', this.commenceCommit);
        document.removeEventListener('click', this.handleOutsideClick);

        this.commenceFreeze();
    }

    commenceAbort() {
        this.commenceFreeze();
    }

    commenceFreeze() {
        const el = this.freeze(this.__storedElement);

        this.el.parentNode.replaceChild(el, this.el);
        this.__storedElement = null;
        this.el = el;
    }
}

export default AbstractEditor;
