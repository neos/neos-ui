import {getGuestFrameWindow} from '@neos-project/neos-ui-guest-frame/src/dom';

export default formattingRulesRegistry => ({setFormattingUnderCursor, setCurrentlyEditedPropertyName}) => {
    getGuestFrameWindow().NeosCKEditorApi.initialize({
        formattingRules: formattingRulesRegistry.getAllAsObject(),
        setFormattingUnderCursor,
        setCurrentlyEditedPropertyName
    });
};
