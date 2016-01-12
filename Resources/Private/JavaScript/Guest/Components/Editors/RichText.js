import AbstractEditor from './AbstractEditor.js';
import MediumEditor from 'medium-editor';

class RichText extends AbstractEditor {
    thaw(el) {
        const rte = el.cloneNode(true);

        return rte;
    }

    editorDidMount() {
        this.editor = new MediumEditor(this.el, {
            toolbar: {
                buttons: ['bold', 'italic', 'underline', 'anchor']
            }
        });
        this.el.focus();
    }

    hasChanges() {
        if (this.__storedElement) {
            return this.__storedElement.innerHTML !== this.el.innerHTML;
        }

        return false;
    }

    commit() {
        return this.el.innerHTML;
    }

    freeze(el) {
        el.innerHTML = this.commit();
        this.editor.destroy();

        return el;
    }
}

export default (el, property, contextPath) => new RichText(el, property, contextPath);
