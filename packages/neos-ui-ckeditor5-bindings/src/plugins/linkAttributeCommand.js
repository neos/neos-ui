import Command from '@ckeditor/ckeditor5-core/src/command';
import findLinkRange from '@ckeditor/ckeditor5-link/src/findlinkrange';
import toMap from '@ckeditor/ckeditor5-utils/src/tomap';

export default class LinkAttributeCommand extends Command {
    constructor(editor, attributeKey) {
        super(editor);

        this.attributeKey = attributeKey;
    }

    refresh() {
        const model = this.editor.model;
        const doc = model.document;

        this.value = doc.selection.getAttribute(this.attributeKey);
        this.isEnabled = model.schema.checkAttributeInSelection(doc.selection, this.attributeKey);
    }

    execute(value) {
        const model = this.editor.model;
        const doc = model.document;
        const selection = doc.selection;
        const toggleMode = value === undefined;
        value = toggleMode ? !this.value : value;

        model.change(writer => {
            if (toggleMode && !value) {
                const rangesToUnset = selection.isCollapsed ?
                    [findLinkRange(selection.getFirstPosition(), selection.getAttribute('linkHref'), model)] : selection.getRanges();
                for (const range of rangesToUnset) {
                    writer.removeAttribute(this.attributeKey, range);
                }
            } else if (selection.isCollapsed) {
                const position = selection.getFirstPosition();

                if (selection.hasAttribute('linkHref')) {
                    const linkRange = findLinkRange(selection.getFirstPosition(), selection.getAttribute('linkHref'), model);
                    if (value === false) {
                        writer.removeAttribute(this.attributeKey, linkRange);
                    } else {
                        writer.setAttribute(this.attributeKey, value, linkRange);
                        writer.setSelection(linkRange);
                    }
                } else if (value !== '') {
                    const attributes = toMap(selection.getAttributes());
                    attributes.set(this.attributeKey, value);
                    const node = writer.createText(value, attributes);
                    writer.insert(node, position);
                    writer.setSelection(Range.createOn(node));
                }
            } else {
                const ranges = model.schema.getValidRanges(selection.getRanges(), this.attributeKey);

                for (const range of ranges) {
                    if (value === false) {
                        writer.removeAttribute(this.attributeKey, range);
                    } else {
                        writer.setAttribute(this.attributeKey, value, range);
                    }
                }
            }
        });
    }
}
