import registry from 'Host/Extensibility/Registry/index';
import {IconButton} from 'Components/index';

registry.ckEditor.formattingAndStyling.add('h1', { style: { element: 'h1' } });
registry.ckEditor.formattingAndStyling.add('h2', { style: { element: 'h2' } });
registry.ckEditor.formattingAndStyling.add('h3', { style: { element: 'h3' } });
registry.ckEditor.formattingAndStyling.add('h4', { style: { element: 'h4' } });
registry.ckEditor.formattingAndStyling.add('h5', { style: { element: 'h5' } });


registry.ckEditor.formattingAndStyling.add('bold', { command: 'bold' });
registry.ckEditor.toolbar.add('bold', {
    formatting: 'bold',
    component: IconButton,
    callbackPropName: 'onClick',

    icon: 'bold',
    hoverStyle: 'brand'
});


registry.ckEditor.formattingAndStyling.add('italic', { command: 'italic' });
registry.ckEditor.toolbar.add('italic', {
    formatting: 'italic',
    component: IconButton,
    callbackPropName: 'onClick',

    icon: 'italic',
    hoverStyle: 'brand'
});