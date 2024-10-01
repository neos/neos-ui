import {Selector, RequestLogger} from 'testcafe';
import {ReactSelector} from 'testcafe-react-selectors';
import {beforeEach, subSection, checkPropTypes} from '../../utils';
import {Page} from '../../pageModel';

/* global fixture:true */

const changeRequestLogger = RequestLogger(request => request.url.endsWith('/neos/ui-services/change') && request.method === 'post' && request.isAjax);
const contentIframeSelector = Selector('[name="neos-content-main"]', {timeout: 2000});

fixture`Create new nodes`
    .beforeEach(beforeEach)
    .afterEach(() => checkPropTypes())
    .requestHooks(changeRequestLogger);

test('Check ClientEval for dependencies between properties of NodeTypes in Creation Dialog', async t => {
    // create node with NodeType labeled: NodeWithDependingProperties_Test
    await t
        .click(Selector('#neos-ContentTree-ToggleContentTree'))
        .click(Page.treeNode.withText('Content Collection (main)'))
        .click(Selector('#neos-ContentTree-AddNode'))
        .click(ReactSelector('NodeTypeItem').find('button>span>span').withText('NodeWithDependingProperties_Test'))

    // in Node Creation Dialog
    const propertyDependedOnSelectBoxSelector = ReactSelector('SelectBoxEditor')
        .withProps('identifier', 'propertyDependedOn--creation-dialog')
        .findReact('SelectBox')

    const propertyDependedOnSelectBox = await propertyDependedOnSelectBoxSelector.getReact()

    const dependingPropertySelectBoxSelector = ReactSelector('SelectBoxEditor')
        .withProps('identifier', 'dependingProperty--creation-dialog')
        .findReact('SelectBox')

    const dependingPropertySelectBox = await dependingPropertySelectBoxSelector.getReact()

    await t
        .expect(propertyDependedOnSelectBox.props.value).eql('odd')
        .expect(propertyDependedOnSelectBox.props.options).eql([
            {'label': 'odd', value: 'odd'},
            {'label': 'even', value: 'even'}
        ])

    await t
        .expect(dependingPropertySelectBox.props.value).eql('')
        .expect(dependingPropertySelectBox.props.options).eql([
            {label: 'label_1', value: 1},
            {label: 'label_3', value: 3},
            {label: 'label_5', value: 5},
            {label: 'label_7', value: 7},
            {label: 'label_9', value: 9}
        ])

    await t.click(propertyDependedOnSelectBoxSelector)
    await t
        .click(Selector('span').withText('even'))
        // FIXME: maybe we should wait for the loading state to finish instead of fixed number of seconds
        .wait(2000)

    // Re-fetch value
    const newPropertyDependedOnSelectBoxValue = (await propertyDependedOnSelectBoxSelector
        .getReact())
        .props
        .value

    // Re-fetch options
    const newDependingPropertySelectBoxOptions = (await dependingPropertySelectBoxSelector
        .getReact())
        .props
        .options

    await t
        .expect(newPropertyDependedOnSelectBoxValue).eql('even')

    await t
        .expect(newDependingPropertySelectBoxOptions).eql([
            {label: 'label_2', value: 2},
            {label: 'label_4', value: 4},
            {label: 'label_6', value: 6},
            {label: 'label_8', value: 8},
            {label: 'label_10', value: 10}
        ])
})

test('Check the nodetype help in create dialog', async t => {
    subSection('Open create dialog node');
    await Page.waitForIframeLoading(t);
    await t
        .switchToIframe(contentIframeSelector)
        .click(Selector('.neos-contentcollection'))
        .click(Selector('#neos-InlineToolbar-AddNode'))
        .switchToMainWindow()
        .click(Selector('button#into'));

    subSection('Open context help and check for Markdown rendering');
    await t
        .click(ReactSelector('NodeTypeItem').withProps({nodeType: {label: 'Headline_Test'}}).find('button svg[data-icon="circle-question"]'))
        .expect(ReactSelector('ReactMarkdown').find('strong').withText('test').exists).ok('Bold test from Markdown has been rendered');
});

test('Check that nodetype without help has no help button', async t => {
    await t
        .switchToIframe(contentIframeSelector)
        .click(Selector('.neos-contentcollection'))
        .click(Selector('#neos-InlineToolbar-AddNode'))
        .switchToMainWindow()
        .click(Selector('button#into'))
        .expect(ReactSelector('NodeTypeItem').withProps({nodeType: {label: 'Text_Test'}}).find('button').count).eql(1);
});

test('Create an Image node from ContentTree', async t => {
    await t.switchToIframe(contentIframeSelector);
    const initialImageCount = await Selector('.test-image[src]').count;
    await t.switchToMainWindow();

    subSection('Create Image node');
    await t
        .click(Selector('#neos-ContentTree-ToggleContentTree'))
        .click(Page.treeNode.withText('Content Collection (main)'))
        .click(Selector('#neos-ContentTree-AddNode'))
        .click(ReactSelector('NodeTypeItem').find('button>span>span').withText('Image_Test'));
    await Page.waitForIframeLoading(t);

    subSection('Select image from media library');
    const imageEditor = await ReactSelector('InspectorEditorEnvelope').withProps('id', 'image');
    await t
        .click(imageEditor.findReact('IconButton').withProps('icon', 'camera'));
    await t.switchToIframe('[name="neos-media-selection-screen"]');
    await t.click('.asset-list .asset a');
    await t.switchToMainWindow();
    await t.click(Selector('#neos-Inspector-Apply'));

    await t.switchToIframe(contentIframeSelector);
    const finalImageCount = await Selector('.test-image[src]').count;
    await t.expect(initialImageCount + 1).eql(finalImageCount, 'Final image count is one more than initial');
});

const newPageTitle = 'TestPage';
test('Can create a new page', async t => {
    const SelectNodeTypeModal = ReactSelector('SelectNodeType');
    await t
        .expect(SelectNodeTypeModal.exists).ok()
        .expect(SelectNodeTypeModal.getReact(({props}) => props.isOpen)).eql(false)
        .click(Selector('#neos-PageTree-AddNode'))
        .expect(SelectNodeTypeModal.getReact(({props}) => props.isOpen)).eql(true)
        .click(ReactSelector('NodeTypeItem').find('button>span>span').withText('Page_Test'))
        .click(Selector('#neos-NodeCreationDialog-Back'))
        .click(ReactSelector('NodeTypeItem').find('button>span>span').withText('Page_Test'))
        .typeText(Selector('#neos-NodeCreationDialog-Body input'), newPageTitle)
        .click(Selector('#neos-NodeCreationDialog-CreateNew'))
        .expect(ReactSelector('NodeCreationDialog').getReact(({props}) => props.isOpen)).eql(false);
    await Page.waitForIframeLoading(t);
    await t
        .switchToIframe(contentIframeSelector)
        .expect(Selector('li').withText(newPageTitle).exists).ok()
        .switchToMainWindow();
});

test('Can create content node from inside InlineUI', async t => {
    const headlineTitle = 'Helloworld!';
    subSection('Create a headline node');
    await Page.waitForIframeLoading(t);
    await t
        .switchToIframe(contentIframeSelector)
        .click(Selector('.neos-contentcollection'))
        .click(Selector('#neos-InlineToolbar-AddNode'))
        .switchToMainWindow()
        .click(Selector('button#into'))
        .click(ReactSelector('NodeTypeItem').withProps({nodeType: {label: 'Headline_Test'}}));

    subSection('Type something inside of it');
    await Page.waitForIframeLoading(t);
    await t
        .switchToIframe(contentIframeSelector)
        .typeText(Selector('.test-headline h1'), headlineTitle)
        .expect(Selector('.neos-contentcollection').withText(headlineTitle).exists).ok('Typed headline text exists');

    subSection('Inline validation');
    // We have to wait for ajax requests to be triggered, since they are debounced for 0.5s
    await t.wait(1600);
    await changeRequestLogger.clear();
    await t
        .expect(Selector('.test-headline h1').exists).ok('Validation tooltip appeared')
        .click('.test-headline h1')
        .pressKey('ctrl+a delete')
        .switchToMainWindow()
        .wait(1600)
        .expect(ReactSelector('InlineValidationTooltips').exists).ok('Validation tooltip appeared');
    await t
        .expect(changeRequestLogger.count(() => true)).eql(0, 'No requests were fired with invalid state');
    await t
        .switchToIframe(contentIframeSelector)
        .typeText(Selector('.test-headline h1'), 'Some text')
        .wait(1600);
    await t.expect(changeRequestLogger.count(() => true)).eql(1, 'Request fired when field became valid');

    subSection('Create a link to node');
    const linkTargetPage = 'Link target';
    await t
        .doubleClick('.test-headline h1')
        .switchToMainWindow()
        .click(ReactSelector('EditorToolbar LinkButton'))
        .typeText(ReactSelector('EditorToolbar LinkButton TextInput'), linkTargetPage)
        .click(ReactSelector('EditorToolbar ContextDropDownContents NodeOption'))
        .switchToIframe(contentIframeSelector)
        .expect(Selector('.test-headline h1 a').withAttribute('href').exists).ok('Newly inserted link exists')
        .switchToMainWindow();
});

test('Inline CKEditor mode `paragraph: false` works as expected', async t => {
    subSection('Create an inline headline node');
    await t
        .click(Selector('#neos-ContentTree-ToggleContentTree'))
        .click(Page.treeNode.withText('Content Collection (main)'))
        .click(Selector('#neos-ContentTree-AddNode'))
        .click(ReactSelector('NodeTypeItem').withProps({nodeType: {label: 'Inline_Headline_Test'}}));
    await Page.waitForIframeLoading(t);

    subSection('Insert text into the inline text and press enter');

    await Page.waitForIframeLoading(t);
    await t
        .switchToIframe(contentIframeSelector)
        .typeText(Selector('.test-inline-headline [contenteditable="true"]'), 'Foo Bar')
        .click(Selector('.test-inline-headline [contenteditable="true"]'))
        .pressKey('enter')
        .typeText(Selector('.test-inline-headline [contenteditable="true"]'), 'Bun Buz')
        .expect(Selector('.neos-contentcollection').withText('Foo Bar').exists).ok('Inserted text exists');

    await t.switchToMainWindow();
    await t.wait(1500); // we debounce the change
    await t.expect(ReactSelector('Inspector TextAreaEditor').withProps({value: 'Foo Bar<br>Bun Buz'}).exists).ok('The TextAreaEditor mirrors the expected value')
});

test('Supports secondary inspector view for element editors', async t => {
    const SelectNodeTypeModal = ReactSelector('SelectNodeType');
    await t
        .expect(SelectNodeTypeModal.exists).ok()
        .expect(SelectNodeTypeModal.getReact(({props}) => props.isOpen)).eql(false)
        .click(Selector('#neos-PageTree-AddNode'))
        .expect(SelectNodeTypeModal.getReact(({props}) => props.isOpen)).eql(true)
        .click(ReactSelector('NodeTypeItem').find('button>span>span').withText('PageWithImage_Test'))
        .typeText(Selector('#neos-NodeCreationDialog-Body input'), 'TestPage with Image');

    const imageEditor = await ReactSelector('NodeCreationDialog ImageEditor').withProps('id', '__neos__editor__property---image--creation-dialog');
    await t
        .click(imageEditor.findReact('IconButton').withProps('icon', 'camera'))
        .switchToIframe(Selector('[name="neos-media-selection-screen"]', {timeout: 2000}))
        .click(Selector('.asset').withText('neos_primary.png'));

    await t.switchToMainWindow();

    await t
        .click(imageEditor.find('button[title="Crop"]'));
    const initialLeftOffset = await imageEditor.find('img').getStyleProperty('left');

    await t
        .click(Selector('.ReactCrop')) // Click to unset any previous selection
        .drag(Selector('.ReactCrop'), 50, 50, {offsetX: 5, offsetY: 5})
        .expect(imageEditor.find('img').getStyleProperty('left')).notEql(initialLeftOffset, 'The preview image in the creation dialog should reflect the cropping results');

    const leftOffsetAfterCrop = await imageEditor.find('img').getStyleProperty('left');

    await t
        .click(Selector('#neos-NodeCreationDialog-CreateNew'))
        .expect(ReactSelector('NodeCreationDialog').getReact(({props}) => props.isOpen)).eql(false);
    await Page.waitForIframeLoading(t);

    const inspectorImageEditor = await ReactSelector('InspectorEditorEnvelope').withProps('id', 'image');
    await t.expect(inspectorImageEditor.find('img').getStyleProperty('left')).eql(leftOffsetAfterCrop, 'The preview image in the inspector should reflect the same cropping results set in the creation dialog');
});
