import {getGuestFrameWindow} from '@neos-project/neos-ui-guest-frame/src/dom';

export default (formattingRulesRegistry, pluginsRegistry) => ({setFormattingUnderCursor, setCurrentlyEditedPropertyName}) => {
    getGuestFrameWindow().NeosCKEditorApi.initialize({
        formattingRules: formattingRulesRegistry.getAllAsObject(),
        plugins: pluginsRegistry.getAllAsObject(),
        setFormattingUnderCursor,
        setCurrentlyEditedPropertyName
    });
};
