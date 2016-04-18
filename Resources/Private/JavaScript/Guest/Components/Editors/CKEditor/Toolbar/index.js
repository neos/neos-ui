import {
    FORMAT_PARAGRAPH,
    FORMAT_HEADLINE1,
    FORMAT_HEADLINE2,
    FORMAT_HEADLINE3,
    FORMAT_HEADLINE4,
    FORMAT_HEADLINE5,
    FORMAT_HEADLINE6,
    FORMAT_PREFORMATTED_TEXT,
    FORMAT_REMOVE_FORMAT,
    FORMAT_BOLD,
    FORMAT_ITALIC,
    FORMAT_UNDERLINE,
    FORMAT_SUBSCRIPT,
    FORMAT_SUPERSCRIPT,
    FORMAT_STRIKETHROUGH,
    FORMAT_ORDERED_LIST,
    FORMAT_UNORDERED_LIST,
    FORMAT_ALIGN_LEFT,
    FORMAT_ALIGN_RIGHT,
    FORMAT_ALIGN_CENTER,
    FORMAT_ALIGN_JUSTIFY
} from '../Constants/formats';
import helperCreator from './Helper/index';

export default (editor, editorApi, configuration) => {
    const {
        createToolbar,
        createButton,
        createDropDown,
        createDropDownItem
    } = helperCreator(editor);
    const {formats} = configuration;

    return editorApi.registerToolbar(
        createToolbar(
            createDropDown(
                'Choose a format...',
                createDropDownItem('paragraph', 'Paragraph', FORMAT_PARAGRAPH, formats.p),
                createDropDownItem('header', 'Headline 1', FORMAT_HEADLINE1, formats.h1),
                createDropDownItem('header', 'Headline 2', FORMAT_HEADLINE2, formats.h2),
                createDropDownItem('header', 'Headline 3', FORMAT_HEADLINE3, formats.h3),
                createDropDownItem('header', 'Headline 4', FORMAT_HEADLINE4, formats.h4),
                createDropDownItem('header', 'Headline 5', FORMAT_HEADLINE5, formats.h5),
                createDropDownItem('header', 'Headline 6', FORMAT_HEADLINE6, formats.h6),
                createDropDownItem('font', 'Preformatted Text',
                    FORMAT_PREFORMATTED_TEXT, formats.pre),
                createDropDownItem('eraser', 'Remove Format',
                    FORMAT_REMOVE_FORMAT, formats.removeFormat)
            ),
            createButton('bold', FORMAT_BOLD, formats.bold),
            createButton('italic', FORMAT_ITALIC, formats.italic),
            createButton('underline', FORMAT_UNDERLINE, formats.underline),
            createButton('subscript', FORMAT_SUBSCRIPT, formats.sub),
            createButton('superscript', FORMAT_SUPERSCRIPT, formats.sup),
            createButton('strikethrough', FORMAT_STRIKETHROUGH, formats.strikethrough),
            createButton('list-ol', FORMAT_ORDERED_LIST, formats.ol),
            createButton('list-ul', FORMAT_UNORDERED_LIST, formats.ul),
            createButton('align-left', FORMAT_ALIGN_LEFT, formats.alignLeft),
            createButton('align-center', FORMAT_ALIGN_RIGHT, formats.alignCenter),
            createButton('align-right', FORMAT_ALIGN_CENTER, formats.alignRight),
            createButton('align-justify', FORMAT_ALIGN_JUSTIFY, formats.alignJustify),
        )
    );
};
