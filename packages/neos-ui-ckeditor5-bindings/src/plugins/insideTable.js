import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Command from '@ckeditor/ckeditor5-core/src/command';

class InsideTableCommand extends Command {
    refresh() {
        const {selection} = this.editor.model.document;
        const tableParent = selection.getFirstPosition().findAncestor('table');

        this.value = Boolean(tableParent);
    }

    execute() {
        console.warn('This command is not meant to be executed, it is used only to check if you are within a table');
    }
}

export default class InsideTable extends Plugin {
    static get pluginName() {
        return 'InsideTable';
    }

    init() {
        this.editor.commands.add('insideTable', new InsideTableCommand(this.editor));
    }
}
