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
                buttons: ['bold', 'italic', 'underline']
            }
        });
        this.el.focus();
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

export default (el, value) => new RichText(el, value);
