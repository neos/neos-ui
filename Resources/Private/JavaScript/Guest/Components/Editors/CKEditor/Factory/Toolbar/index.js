import helperCreator from './Helper/index';

export default (node, property, ckApi, editor, editorApi) => {
    const {
        createToolbar,
        createButton,
        createDropDown,
        createDropDownItem
    } = helperCreator(ckApi, editor);
    const configuration = node.nodeType.properties[property].ui.aloha || {};
    const format = configuration.format ?
        Object.keys(configuration.format).map(k => configuration.format[k]) : [];
    const list = configuration.list ?
        Object.keys(configuration.list).map(k => configuration.list[k]) : [];
    const alignment = configuration.alignment ?
        Object.keys(configuration.alignment).map(k => configuration.alignment[k]) : [];
    const dropDownItems = [
        format.indexOf('p') !== -1 &&
        createDropDownItem('paragraph', 'Paragraph', {element: 'p'}),

        format.indexOf('h1') !== -1 &&
        createDropDownItem('header', 'Headline 1', {element: 'h1'}),

        format.indexOf('h2') !== -1 &&
        createDropDownItem('header', 'Headline 2', {element: 'h2'}),

        format.indexOf('h3') !== -1 &&
        createDropDownItem('header', 'Headline 3', {element: 'h3'}),

        format.indexOf('h4') !== -1 &&
        createDropDownItem('header', 'Headline 4', {element: 'h4'}),

        format.indexOf('h5') !== -1 &&
        createDropDownItem('header', 'Headline 5', {element: 'h5'}),

        format.indexOf('h6') !== -1 &&
        createDropDownItem('header', 'Headline 6', {element: 'h6'}),

        format.indexOf('pre') !== -1 &&
        createDropDownItem('font', 'Preformatted Text', {element: 'pre'})
    ].filter(i => i);
    const toolbarItems = [
        dropDownItems.length &&
        createDropDown(...dropDownItems),

        (format.indexOf('strong') !== -1 || format.indexOf('b') !== -1) &&
        createButton('bold', 'bold'),

        (format.indexOf('em') !== -1 || format.indexOf('i') !== -1) &&
        createButton('italic', 'italic'),

        format.indexOf('u') !== -1 &&
        createButton('underline', 'underline'),

        format.indexOf('sub') !== -1 &&
        createButton('subscript', 'subscript'),

        format.indexOf('sup') !== -1 &&
        createButton('superscript', 'superscript'),

        format.indexOf('del') !== -1 &&
        createButton('strikethrough', 'strike'),

        list.indexOf('ol') !== -1 &&
        createButton('list-ol', 'numberedlist'),

        list.indexOf('ul') !== -1 &&
        createButton('list-ul', 'bulletedlist'),

        alignment.indexOf('left') !== -1 &&
        createButton('align-left', 'justifyleft'),

        alignment.indexOf('center') !== -1 &&
        createButton('align-center', 'justifycenter'),

        alignment.indexOf('right') !== -1 &&
        createButton('align-right', 'justifyright'),

        alignment.indexOf('justify') !== -1 &&
        createButton('align-justify', 'justifyblock')
    ].filter(i => i);

    return editorApi.registerToolbar(
        createToolbar(
            ...toolbarItems
        )
    );
};
