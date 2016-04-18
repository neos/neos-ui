import helperCreator from './Helper/index';

export default (ckApi, editor, editorApi) => {
    const {
        createToolbar,
        createButton,
        createDropDown,
        createDropDownItem
    } = helperCreator(ckApi, editor);

    return editorApi.registerToolbar(
        createToolbar(
            createDropDown(
                createDropDownItem('paragraph', 'Paragraph', {element: 'p'}),
                createDropDownItem('header', 'Headline 1', {element: 'h1'}),
                createDropDownItem('header', 'Headline 2', {element: 'h2'}),
                createDropDownItem('header', 'Headline 3', {element: 'h3'}),
                createDropDownItem('header', 'Headline 4', {element: 'h4'}),
                createDropDownItem('header', 'Headline 5', {element: 'h5'}),
                createDropDownItem('header', 'Headline 6', {element: 'h6'}),
                createDropDownItem('font', 'Preformatted Text', {element: 'pre'})
            ),
            createButton('bold', 'bold'),
            createButton('italic', 'italic'),
            createButton('underline', 'underline'),
            createButton('subscript', 'subscript'),
            createButton('superscript', 'superscript'),
            createButton('strikethrough', 'strike'),
            createButton('list-ol', 'numberedlist'),
            createButton('list-ul', 'bulletedlist'),
            createButton('align-left', 'justifyleft'),
            createButton('align-center', 'justifycenter'),
            createButton('align-right', 'justifyright'),
            createButton('align-justify', 'justifyblock')
        )
    );
};
