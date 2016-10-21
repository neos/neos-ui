import {SynchronousRegistry} from '@neos-project/neos-ui-extensibility/registry';

class CkEditorFormattingRulesRegistry extends SynchronousRegistry {
    constructor(...args) {
        super(...args);

        this.config = {

            /**
             * add a tag name to the CKEditor block-level formatting config "format_tags",
             * and ensure the "Format" selector is visible
             */
            addToFormatTags: tagName =>
                config => {
                    if (config.format_tags) { // eslint-disable-line camelcase
                        config.format_tags += ';'; // eslint-disable-line camelcase
                    } else {
                        config.format_tags = ''; // eslint-disable-line camelcase
                    }

                    config.format_tags += tagName; // eslint-disable-line camelcase

                    config = this.config.add('Format')(config);

                    return config;
                },
            /**
             * adds the given "buttonName" to the list of enabled buttons, i.e. configuring ACF for them correctly
             */
            add: buttonName =>
                config => {
                    if (!config.buttons) {
                        config.buttons = [];
                    }
                    if (config.buttons.indexOf(buttonName) === -1) {
                        config.buttons.push(buttonName);
                    }

                    return config;
                }
        };
    }
}
