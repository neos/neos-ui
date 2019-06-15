import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import {stripTags} from '@neos-project/utils-helpers';
import styles from './neosPlaceholder.vanilla-css'; // eslint-disable-line no-unused-vars

// If the data is "empty" (BR, P) or the placeholder then return an empty string.
// Otherwise return the original data
const htmlIsEmptyish = data => {
    if (!data) {
        return true;
    }

    if (data.length > 20) {
        return false;
    }
    const value = data.replace(/[\n|\t|\u200b]*/g, '').toLowerCase().trim();
    const a = (
        !value ||
        value === '<br>' ||
        value === '<span>&nbsp;</span>' ||
        value === '<p>&nbsp;</p>' ||
        value === '<p>&nbsp;<br></p>' ||
        value === '<p><br></p>' ||
        value === '&nbsp;' ||
        value === '&nbsp;<br>' ||
        value === ' <br>' ||
        value.match(/^<([a-z0-9]+)><br><\/\1>$/)
    );
    return a;
};

export default class NeosPlaceholder extends Plugin {
    static get pluginName() {
        return 'NeosPlaceholder';
    }

    getPlaceholder() {
        return stripTags(this.editor.config.get('neosPlaceholder'));
    }

    addPlaceholder() {
        this.editor.editing.view.change(writer => {
            writer.setAttribute('data-neos-placeholder', this.getPlaceholder(), this.editor.editing.view.document.getRoot());
        });
    }

    removePlaceholder() {
        this.editor.editing.view.change(writer => {
            writer.removeAttribute('data-neos-placeholder', this.editor.editing.view.document.getRoot());
        });
    }

    updatePlaceholder() {
        if (htmlIsEmptyish(this.editor.getData({trim: 'none'})) && !this.editor.ui.focusTracker.isFocused) {
            this.addPlaceholder();
        } else {
            this.removePlaceholder();
        }
    }

    init() {
        if (this.editor.config.get('neosPlaceholder')) {
            this.updatePlaceholder();

            const model = this.editor.data.model;

            model.on('applyOperation', () => {
                this.updatePlaceholder();
                return true;
            });
            this.editor.ui.focusTracker.on('change:isFocused', () => {
                this.updatePlaceholder();
            });
        }
    }
}
