import AbstractEditor from './AbstractEditor';
import MediumEditor from 'medium-editor';

export default class Oneline extends AbstractEditor {

    thaw(el, value) {
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
