import {Selector, RequestLogger} from 'testcafe';
import {ReactSelector} from 'testcafe-react-selectors';
import {beforeEach, subSection, checkPropTypes} from './../../utils.js';
import {Page} from './../../pageModel';

/* global fixture:true */

const changeRequestLogger = RequestLogger(request => request.url.endsWith('/neos/ui-services/change') && request.method === 'post' && request.isAjax);

fixture`Create new nodes`
    .beforeEach(beforeEach)
    .afterEach(() => checkPropTypes())
    .requestHooks(changeRequestLogger);

test('Create an Image node from ContentTree', async t => {
    await t.switchToIframe('[name="neos-content-main"]');
    const initialImageCount = await Selector('.test-image img[src]').count;
    await t.switchToMainWindow();

    subSection('Create Image node');
    await t
        .click(Selector('#neos-ContentTree-ToggleContentTree'))
        .click(Page.treeNode.withText('Content Collection (main)'))
        .click(Selector('#neos-ContentTree-AddNode'))
        .click(ReactSelector('NodeTypeItem').find('button>span>span').withText('Image'));
    await Page.waitForIframeLoading(t);

    subSection('Select image from media library');
    const imageEditor = await ReactSelector('InspectorEditorEnvelope').withProps('id', 'image');
    await t
        .click(imageEditor.findReact('IconButton').withProps('icon', 'camera'));
    await t.switchToIframe('[name="neos-media-selection-screen"]');
    await t.click('.asset-list .asset a');
    await t.switchToMainWindow();
    await t.click(Selector('#neos-Inspector-Apply'));

    await t.switchToIframe('[name="neos-content-main"]');
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
        .click(ReactSelector('NodeTypeItem'))
        .click(Selector('#neos-NodeCreationDialog-Back'))
        .click(ReactSelector('NodeTypeItem'))
        .typeText(Selector('#neos-NodeCreationDialog-Body input'), newPageTitle)
        .click(Selector('#neos-NodeCreationDialog-CreateNew'))
        .expect(ReactSelector('NodeCreationDialog').getReact(({props}) => props.isOpen)).eql(false);
    await Page.waitForIframeLoading(t);
    await t
        .switchToIframe('[name="neos-content-main"]')
        .expect(Selector('li').withText(newPageTitle).exists).ok()
        .switchToMainWindow();
});

test('Can create content node from inside InlineUI', async t => {
    const headlineTitle = 'Helloworld!';
    subSection('Create a headline node');
    await Page.waitForIframeLoading(t);
    await t
        .switchToIframe('[name="neos-content-main"]')
        .click(Selector('.neos-contentcollection'))
        .click(Selector('#neos-InlineToolbar-AddNode'))
        .switchToMainWindow()
        .click(Selector('button#into'))
        // TODO: this selector will only work with English translation.
        // Change to `withProps` when implemented: https://github.com/DevExpress/testcafe-react-selectors/issues/14
        .click(ReactSelector('NodeTypeItem').find('button>span>span').withText('Headline'));

    subSection('Type something inside of it');
    await Page.waitForIframeLoading(t);
    await t
        .switchToIframe('[name="neos-content-main"]')
        .typeText(Selector('.test-headline h1'), headlineTitle)
        .expect(Selector('.neos-contentcollection').withText(headlineTitle).exists).ok('Typed headline text exists');

    subSection('Inline validation');
    // We have to wait for ajax requests to be triggered, since they are debounced for 0.5s
    await t.wait(600);
    await changeRequestLogger.clear();
    await t
        .expect(Selector('.test-headline h1').exists).ok('Validation tooltip appeared')
        .click('.test-headline h1')
        .pressKey('ctrl+a delete')
        .switchToMainWindow()
        .wait(600)
        .expect(ReactSelector('InlineValidationTooltips').exists).ok('Validation tooltip appeared');
    await t
        .expect(changeRequestLogger.count(() => true)).eql(0, 'No requests were fired with invalid state');
    await t
        .switchToIframe('[name="neos-content-main"]')
        .typeText(Selector('.test-headline h1'), 'Some text')
        .wait(600);
    await t.expect(changeRequestLogger.count(() => true)).eql(1, 'Request fired when field became valid');

    subSection('Create a link to node');
    const linkTargetPage = 'Link target';
    await t
        .doubleClick('.test-headline h1')
        .switchToMainWindow()
        .click(ReactSelector('EditorToolbar LinkButton'))
        .typeText(ReactSelector('EditorToolbar LinkButton TextInput'), linkTargetPage)
        .click(ReactSelector('EditorToolbar NodeOption'))
        .switchToIframe('[name="neos-content-main"]')
        .expect(Selector('.test-headline h1 a').withAttribute('href').exists).ok('Newly inserted link exists')
        .switchToMainWindow();
});
