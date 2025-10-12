import {Selector} from 'testcafe';
import {beforeEach, subSection, checkPropTypes} from '../../utils';
import {Page} from '../../pageModel';
import {ReactSelector} from 'testcafe-react-selectors';

/* global fixture:true */

fixture`LinkEditor`.beforeEach(beforeEach).afterEach(() => checkPropTypes());

const LinkStringProperty = Selector('#__neos__editor__property---linkString');
const LinkObjectProperty = Selector('#__neos__editor__property---linkObject');
const LinkEditorNodeTreeItem = Selector('#neos-LinkEditor [data-neos-integrational-test="tree__item__nodeHeader__itemLabel"]');

const OpenLinkEditor = Selector('#neos-LinkEditor').filterVisible();
const WarningOrErrorTooltips = OpenLinkEditor.find('[class*="tooltip--as"]');

// Fixme reintroduce test for inline editable linking. With https://github.com/neos/neos-ui/pull/3883 ckeditor got hacky to test via testcafe.
// 'This test is currently failing due to a bug in testcafe regarding the editable content selection'
// const linkTargetPage = 'Link target';
// await t
//     .doubleClick('.test-headline h1')
//     .switchToMainWindow()
//     .click(ReactSelector('EditorToolbar LinkButton'))
//     .typeText(ReactSelector('EditorToolbar LinkButton TextInput'), linkTargetPage)
//     .click(ReactSelector('EditorToolbar ContextDropDownContents NodeOption'))
//     .switchToIframe(contentIframeSelector)
//     .expect(Selector('.test-headline h1 a').withAttribute('href').exists).ok('Newly inserted link exists')
//     .switchToMainWindow();

test('Open and close link editor dialog without saving the change', async t => {
    const LinkStringValue = ReactSelector('EditorEnvelope').withProps({ identifier: 'linkString' }).getReact(({props}) => props.value);

    await Page.goToPage('Link editor')
    await t.click(Selector('#neos-ContentTree-ToggleContentTree'));
    await t.click(Page.treeNode.withText('LinkEditor_Test'));

    // after each subSection the state must be reset -> order of these subsections does not matter

    subSection('Open and press cancel directly');
    await t.click(LinkStringProperty.withExactText('Create Link'));
    await t.expect(OpenLinkEditor.withText('Edit Link').exists).ok();

    await t.expect(Selector('#neos-LinkEditor button').withExactText('Apply').hasAttribute('disabled')).ok();
    await t.expect(Selector('#neos-LinkEditor button').withExactText('Cancel').hasAttribute('disabled')).notOk();

    await t.click(Selector('#neos-LinkEditor button').withExactText('Cancel'));
    await t.expect(OpenLinkEditor.exists).notOk();

    subSection('Open and press escape directly');
    await t.click(LinkStringProperty.withExactText('Create Link'));

    await t.expect(OpenLinkEditor.withText('Edit Link').exists).ok();
    await t.pressKey('esc')
    await t.expect(OpenLinkEditor.exists).notOk();

    subSection('Open and press cancel after selecting target node');
    await t.click(LinkStringProperty.withExactText('Create Link'));

    await t.expect(OpenLinkEditor.withText('Edit Link').exists).ok();

    await t.click(LinkEditorNodeTreeItem.withExactText('Link target'));

    await t.expect(Selector('#neos-LinkEditor button').withExactText('Apply').hasAttribute('disabled')).notOk();
    await t.expect(Selector('#neos-LinkEditor button').withExactText('Cancel').hasAttribute('disabled')).notOk();

    // press escape with dirty state prevents accidental closing
    await t.pressKey('esc')
    await t.expect(OpenLinkEditor.exists).ok();

    await t.click(Selector('#neos-LinkEditor button').withExactText('Cancel'));
    await t.expect(OpenLinkEditor.exists).notOk();

    subSection('Open and select target node but discard change in inspector');
    await t.click(LinkStringProperty.withExactText('Create Link'));

    await t.expect(OpenLinkEditor.withText('Edit Link').exists).ok();

    await t.click(LinkEditorNodeTreeItem.withExactText('Link target'));

    await t.click(Selector('#neos-LinkEditor button').withExactText('Apply'));
    await t.expect(OpenLinkEditor.exists).notOk();

    await t.expect(LinkStringProperty.withExactText('Create Link').exists).notOk();
    await t.expect(LinkStringProperty.find('span').withExactText('Link target').exists).ok();
    await t.expect(LinkStringProperty.find('span').withExactText('Home > Link editor > Link target').exists).ok();
    await t.expect(LinkStringProperty.find('[title="Edit Link"]').exists).ok();
    await t.expect(LinkStringProperty.find('[title="Delete Link"]').exists).ok();

    await t.click(Selector('#neos-Inspector-Discard').withExactText('Discard'));

    await t.expect(LinkStringProperty.withExactText('Create Link').exists).ok();

    subSection('Open and select target node but delete via trash can on property in inspector');
    await t.click(LinkStringProperty.withExactText('Create Link'));

    await t.expect(OpenLinkEditor.withText('Edit Link').exists).ok();
    await t.click(LinkEditorNodeTreeItem.withExactText('Link target'));
    await t.click(Selector('#neos-LinkEditor button').withExactText('Apply'));
    await t.expect(OpenLinkEditor.exists).notOk();

    await t.expect(LinkStringProperty.withExactText('Create Link').exists).notOk();
    await t.click(LinkStringProperty.find('[title="Delete Link"]'));

    await t.expect(LinkStringProperty.withExactText('Create Link').exists).ok();
    await t.expect(LinkStringValue).eql('');

    // cleanup state (noop)
    await t.click(Selector('#neos-Inspector-Discard').withExactText('Discard'));

    subSection('Open and select target node and directly delete target and cancel');
    await t.click(LinkStringProperty.withExactText('Create Link'));

    await t.expect(OpenLinkEditor.withText('Edit Link').exists).ok();

    await t.click(LinkEditorNodeTreeItem.withExactText('Link target'));
    await t.click('#neos-LinkEditor-Preview [title="Delete Link"]');
    await t.expect(Selector('#neos-LinkEditor-Preview').exists).notOk();
    await t.expect(Selector('#neos-LinkEditor [role="tab"]').withExactText('Document').getAttribute('aria-selected')).eql('true');

    // apply is disabled because we reset the state via the delete and nothing is dirty
    await t.expect(Selector('#neos-LinkEditor button').withExactText('Apply').hasAttribute('disabled')).ok();
    await t.click(Selector('#neos-LinkEditor button').withExactText('Cancel'));

    await t.expect(OpenLinkEditor.exists).notOk();

    await t.expect(LinkStringProperty.withExactText('Create Link').exists).ok();
    await t.expect(LinkStringValue).eql('');

    // cleanup state (noop)
    await t.click(Selector('#neos-Inspector-Discard').withExactText('Discard'));

    subSection('Open and select web link and directly delete link and cancel');
    await t.click(LinkStringProperty.withExactText('Create Link'));

    await t.expect(OpenLinkEditor.withText('Edit Link').exists).ok();

    await t.click(Selector('#neos-LinkEditor [role="tab"]').withExactText('Web'));
    await t.typeText(Selector('#neos-LinkEditor [id="__neos__editor__property---LinkEditor:Web.href"]'), 'www.neos.io')

    await t.click('#neos-LinkEditor-Preview [title="Delete Link"]');
    await t.expect(Selector('#neos-LinkEditor-Preview').exists).notOk();

    // still in web tab
    await t.expect(Selector('#neos-LinkEditor [role="tab"]').withExactText('Web').getAttribute('aria-selected')).eql('true');

    await t.click(Selector('#neos-LinkEditor button').withExactText('Cancel'));

    await t.expect(OpenLinkEditor.exists).notOk();

    await t.expect(LinkStringProperty.withExactText('Create Link').exists).ok();
    await t.expect(LinkStringValue).eql('');

    // cleanup state (noop)
    await t.click(Selector('#neos-Inspector-Discard').withExactText('Discard'));

    subSection('Open and apply target node, Reopen and delete target and apply');
    await t.click(LinkStringProperty.withExactText('Create Link'));

    await t.expect(OpenLinkEditor.withText('Edit Link').exists).ok();

    await t.click(LinkEditorNodeTreeItem.withExactText('Link target'));
    await t.click(Selector('#neos-LinkEditor button').withExactText('Apply'));
    await t.expect(OpenLinkEditor.exists).notOk();

    await t.expect(LinkStringProperty.withExactText('Create Link').exists).notOk();
    await t.click(LinkStringProperty.find('[title="Edit Link"]'));

    await t.expect(OpenLinkEditor.withText('Edit Link').exists).ok();
    await t.click('#neos-LinkEditor-Preview [title="Delete Link"]');
    await t.expect(Selector('#neos-LinkEditor-Preview').exists).notOk();

    await t.click(Selector('#neos-LinkEditor button').withExactText('Apply'));
    await t.expect(OpenLinkEditor.exists).notOk();

    await t.expect(LinkStringProperty.withExactText('Create Link').exists).ok();
    await t.expect(LinkStringValue).eql('');

    // cleanup state (noop)
    await t.click(Selector('#neos-Inspector-Discard').withExactText('Discard'));

    subSection('Open and apply target node, Reopen and edit anchor option');
    await t.click(LinkStringProperty.withExactText('Create Link'));

    await t.expect(OpenLinkEditor.withText('Edit Link').exists).ok();

    await t.click(LinkEditorNodeTreeItem.withExactText('Link target'));
    await t.click(Selector('#neos-LinkEditor button').withExactText('Apply'));
    await t.expect(OpenLinkEditor.exists).notOk();

    await t.expect(LinkStringValue).eql('node://link-target');

    await t.expect(LinkStringProperty.withExactText('Create Link').exists).notOk();
    await t.click(LinkStringProperty.find('[title="Edit Link"]'));

    await t.expect(OpenLinkEditor.withText('Edit Link').exists).ok();

    // apply button is initially disabled
    await t.expect(Selector('#neos-LinkEditor button').withExactText('Apply').hasAttribute('disabled')).ok();
    await t.typeText(Selector('#neos-LinkEditor label').withExactText('Anchor:').find('input'), 'my-anchor')

    await t.click(Selector('#neos-LinkEditor button').withExactText('Apply'));
    await t.expect(OpenLinkEditor.exists).notOk();

    await t.expect(LinkStringValue).eql('node://link-target#my-anchor');

    // cleanup state
    await t.click(Selector('#neos-Inspector-Discard').withExactText('Discard'));

    subSection('Open and apply web link, Reopen and insert asset but delete link');
    await t.click(LinkStringProperty.withExactText('Create Link'));

    await t.expect(OpenLinkEditor.withText('Edit Link').exists).ok();

    await t.click(Selector('#neos-LinkEditor [role="tab"]').withExactText('Web'));
    await t.typeText(Selector('#neos-LinkEditor [id="__neos__editor__property---LinkEditor:Web.href"]'), 'https://www.neos.io#my-anchor')

    await t.click(Selector('#neos-LinkEditor button').withExactText('Apply'));
    await t.expect(OpenLinkEditor.exists).notOk();

    await t.expect(LinkStringValue).eql('https://www.neos.io#my-anchor');

    await t.expect(LinkStringProperty.withExactText('Create Link').exists).notOk();
    await t.click(LinkStringProperty.find('[title="Edit Link"]'));

    await t.expect(OpenLinkEditor.withText('Edit Link').exists).ok();

    await t.click(Selector('#neos-LinkEditor [role="tab"]').withExactText('Asset'));

    await t.switchToIframe(Selector('[name="neos-media-selection-screen"]', {timeout: 2000}))
        .click(Selector('.asset').withText('neos_primary.png'))
        .switchToMainWindow();

    // anchor is unset
    await t.expect(Selector('#neos-LinkEditor label').withExactText('Anchor:').find('input').value).eql('')

    await t.click('#neos-LinkEditor-Preview [title="Delete Link"]');
    await t.expect(Selector('#neos-LinkEditor-Preview').exists).notOk();

    // still in asset tab
    await t.expect(Selector('#neos-LinkEditor [role="tab"]').withExactText('Asset').getAttribute('aria-selected')).eql('true');

    await t.click(Selector('#neos-LinkEditor button').withExactText('Apply'));
    await t.expect(OpenLinkEditor.exists).notOk();

    await t.expect(LinkStringValue).eql('');

    // cleanup state
    await t.click(Selector('#neos-Inspector-Discard').withExactText('Discard'));

    subSection('Open and select target node and anchor switch to web and set link and apply');
    await t.click(LinkStringProperty.withExactText('Create Link'));

    await t.expect(OpenLinkEditor.withText('Edit Link').exists).ok();

    await t.typeText(Selector('#neos-LinkEditor label').withExactText('Anchor:').find('input'), 'my-anchor');
    // an anchor alone cannot be applied
    await t.expect(Selector('#neos-LinkEditor button').withExactText('Apply').hasAttribute('disabled')).ok();

    await t.click(LinkEditorNodeTreeItem.withExactText('Link target'));
    await t.expect(Selector('#neos-LinkEditor button').withExactText('Apply').hasAttribute('disabled')).notOk();

    await t.click(Selector('#neos-LinkEditor [role="tab"]').withExactText('Web'));

    await t.expect(Selector('#neos-LinkEditor button').withExactText('Apply').hasAttribute('disabled')).ok();

    await t.typeText(Selector('#neos-LinkEditor [id="__neos__editor__property---LinkEditor:Web.href"]'), 'https://www.neos.io')

    await t.click(Selector('#neos-LinkEditor button').withExactText('Apply'));
    await t.expect(OpenLinkEditor.exists).notOk();

    await t.expect(LinkStringValue).eql('https://www.neos.io');

    // cleanup state
    await t.click(Selector('#neos-Inspector-Discard').withExactText('Discard'));

    subSection('Open and enter invalid email which shows warnings');
    await t.click(LinkStringProperty.withExactText('Create Link'));

    await t.expect(OpenLinkEditor.withText('Edit Link').exists).ok();
    await t.click(Selector('#neos-LinkEditor [role="tab"]').withExactText('Mail to'));

    // "mail" is not a valid email address, we emit a warning but do not prevent apply because validating a full email is almost impossible :D
    await t.typeText(Selector('#neos-LinkEditor [id="__neos__editor__property---LinkEditor:MailTo.recipient"]'), 'mail');
    await t.expect(Selector('#neos-LinkEditor button').withExactText('Apply').hasAttribute('disabled')).notOk();

    await t.expect(WarningOrErrorTooltips.exists).ok();
    await t.expect(OpenLinkEditor.withText('Recipient should be a valid E-Mail Address').exists).ok();

    // turn the text into a valid mail
    await t.typeText(Selector('#neos-LinkEditor [id="__neos__editor__property---LinkEditor:MailTo.recipient"]'), '@neos.io');
    await t.expect(WarningOrErrorTooltips.exists).notOk();
    await t.expect(OpenLinkEditor.withText('Recipient should be a valid E-Mail Address').exists).notOk();

    await t.click(Selector('#neos-LinkEditor button').withExactText('Apply'));
    await t.expect(OpenLinkEditor.exists).notOk();

    await t.expect(LinkStringValue).eql('mailto:mail@neos.io');

    // cleanup state
    await t.click(Selector('#neos-Inspector-Discard').withExactText('Discard'));

    subSection('Open and enter invalid email and apply change in other tab');
    await t.click(LinkStringProperty.withExactText('Create Link'));

    await t.expect(OpenLinkEditor.withText('Edit Link').exists).ok();
    await t.click(Selector('#neos-LinkEditor [role="tab"]').withExactText('Mail to'));

    // an empty spaced string is not a valid email address
    await t.typeText(Selector('#neos-LinkEditor [id="__neos__editor__property---LinkEditor:MailTo.recipient"]'), '   ');
    await t.expect(Selector('#neos-LinkEditor button').withExactText('Apply').hasAttribute('disabled')).ok();
    await t.expect(WarningOrErrorTooltips.exists).ok();
    await t.expect(OpenLinkEditor.withText('Recipient should be a valid E-Mail Address').exists).ok();

    await t.click(Selector('#neos-LinkEditor [role="tab"]').withExactText('Document'));
    await t.click(LinkEditorNodeTreeItem.withExactText('Link target'));

    // can be applied
    await t.expect(Selector('#neos-LinkEditor button').withExactText('Apply').hasAttribute('disabled')).notOk();

    // Mail tab is still invalid
    await t.click(Selector('#neos-LinkEditor [role="tab"]').withExactText('Mail to'));
    await t.expect(WarningOrErrorTooltips.exists).ok();
    await t.expect(OpenLinkEditor.withText('Recipient should be a valid E-Mail Address').exists).ok();
    await t.expect(Selector('#neos-LinkEditor button').withExactText('Apply').hasAttribute('disabled')).ok();

    // Apply document selection
    await t.click(Selector('#neos-LinkEditor [role="tab"]').withExactText('Document'));

    await t.click(Selector('#neos-LinkEditor button').withExactText('Apply'));
    await t.expect(OpenLinkEditor.exists).notOk();

    await t.expect(LinkStringValue).eql('node://link-target');

    // cleanup state
    await t.click(Selector('#neos-Inspector-Discard').withExactText('Discard'));

    subSection('Open and enter invalid web targets');
    await t.click(LinkStringProperty.withExactText('Create Link'));

    await t.expect(OpenLinkEditor.withText('Edit Link').exists).ok();
    await t.click(Selector('#neos-LinkEditor [role="tab"]').withExactText('Web'));

    await t.expect(Selector('#neos-LinkEditor button').withExactText('Apply').hasAttribute('disabled')).ok();

    await t.expect(Selector('#neos-LinkEditor button').withExactText('Apply').hasAttribute('disabled')).ok();

    // valid https url
    await t.typeText(Selector('#neos-LinkEditor [id="__neos__editor__property---LinkEditor:Web.href"]'), 'neos.io')
    await t.expect(WarningOrErrorTooltips.exists).notOk();
    await t.expect(Selector('#neos-LinkEditor button').withExactText('Apply').hasAttribute('disabled')).notOk();

    // empty url is invalid
    await t.click(Selector('#neos-LinkEditor [id="__neos__editor__property---LinkEditor:Web.href"]')).pressKey('ctrl+a delete')
    // todo await t.expect(WarningOrErrorTooltips.exists).ok();
    // todo await t.expect(OpenLinkEditor.withText('URL is required').exists).ok();
    await t.expect(Selector('#neos-LinkEditor button').withExactText('Apply').hasAttribute('disabled')).ok();

    // invalid javascript url
    await t.typeText(Selector('#neos-LinkEditor [id="__neos__editor__property---LinkEditor:Web.href"]'), 'javascript:alert()')
    await t.expect(OpenLinkEditor.find('[class*="tooltip--asWarning"]').exists).ok();
    // todo await t.expect(OpenLinkEditor.withText('Invalid url').exists).ok();
    // soft validation
    await t.expect(Selector('#neos-LinkEditor button').withExactText('Apply').hasAttribute('disabled')).notOk();

    await t.click(Selector('#neos-LinkEditor button').withExactText('Cancel'));
    await t.expect(OpenLinkEditor.exists).notOk();

    // cleanup state
    await t.click(Selector('#neos-Inspector-Discard').withExactText('Discard'));

    subSection('Open and select empty relative web target and apply');
    await t.click(LinkStringProperty.withExactText('Create Link'));

    await t.expect(OpenLinkEditor.withText('Edit Link').exists).ok();
    await t.click(Selector('#neos-LinkEditor [role="tab"]').withExactText('Web'));

    await t.expect(Selector('#neos-LinkEditor button').withExactText('Apply').hasAttribute('disabled')).ok();

    await t.typeText(Selector('#neos-LinkEditor [id="__neos__editor__property---LinkEditor:Web.href"]'), '#')
    // change can be applied
    await t.expect(Selector('#neos-LinkEditor button').withExactText('Apply').hasAttribute('disabled')).notOk();

    await t.click(Selector('#neos-LinkEditor button').withExactText('Apply'));
    await t.expect(OpenLinkEditor.exists).notOk();

    await t.expect(LinkStringValue).eql('#');

    // cleanup state
    await t.click(Selector('#neos-Inspector-Discard').withExactText('Discard'));

    subSection('Open and select empty relative web target with anchor and apply');
    await t.click(LinkStringProperty.withExactText('Create Link'));

    await t.expect(OpenLinkEditor.withText('Edit Link').exists).ok();
    await t.click(Selector('#neos-LinkEditor [role="tab"]').withExactText('Web'));

    await t.expect(Selector('#neos-LinkEditor button').withExactText('Apply').hasAttribute('disabled')).ok();

    await t.typeText(Selector('#neos-LinkEditor [id="__neos__editor__property---LinkEditor:Web.href"]'), '#my-anchor')

    await t.expect(Selector('#neos-LinkEditor button').withExactText('Apply').hasAttribute('disabled')).notOk();

    await t.click(Selector('#neos-LinkEditor button').withExactText('Apply'));
    await t.expect(OpenLinkEditor.exists).notOk();

    await t.expect(LinkStringValue).eql('#my-anchor');

    // cleanup state
    await t.click(Selector('#neos-Inspector-Discard').withExactText('Discard'));

    subSection('Open and select empty relative web target apply and reopen to set anchor');
    await t.click(LinkStringProperty.withExactText('Create Link'));

    await t.expect(OpenLinkEditor.withText('Edit Link').exists).ok();
    await t.click(Selector('#neos-LinkEditor [role="tab"]').withExactText('Web'));

    await t.expect(Selector('#neos-LinkEditor button').withExactText('Apply').hasAttribute('disabled')).ok();

    await t.typeText(Selector('#neos-LinkEditor [id="__neos__editor__property---LinkEditor:Web.href"]'), '#')

    await t.expect(Selector('#neos-LinkEditor button').withExactText('Apply').hasAttribute('disabled')).notOk();

    await t.click(Selector('#neos-LinkEditor button').withExactText('Apply'));
    await t.expect(OpenLinkEditor.exists).notOk();

    await t.expect(LinkStringValue).eql('#');

    await t.click(LinkStringProperty.find('[title="Edit Link"]'));
    await t.expect(OpenLinkEditor.withText('Edit Link').exists).ok();
    await t.expect(Selector('#neos-LinkEditor button').withExactText('Apply').hasAttribute('disabled')).ok();

    await t.typeText(Selector('#neos-LinkEditor [id="__neos__editor__property---LinkEditor:Web.href"]'), 'my-anchor')

    await t.click(Selector('#neos-LinkEditor button').withExactText('Apply'));
    await t.expect(OpenLinkEditor.exists).notOk();

    await t.expect(LinkStringValue).eql('#my-anchor');

    // cleanup state
    await t.click(Selector('#neos-Inspector-Discard').withExactText('Discard'));
});

test('Can edit property links via inspector and save the change', async t => {
    await Page.goToPage('Link editor')
    await t.click(Selector('#neos-ContentTree-ToggleContentTree'));
    await t.click(Page.treeNode.withText('LinkEditor_Test'));

    await t.switchToIframe('[name="neos-content-main"]');
    await t.expect(Selector('[data-link-editor-string]').innerText).eql(JSON.stringify(null))
    await t.expect(Selector('[data-link-editor-object]').innerText).eql(JSON.stringify(null))
    await t.switchToMainWindow();

    await t.click(LinkStringProperty.withExactText('Create Link'));
    await t.expect(Selector('#neos-LinkEditor [role="tab"]').withExactText('Document').getAttribute('aria-selected')).eql('true');
    await t.expect(Selector('#neos-LinkEditor [role="tab"]').withExactText('Asset').getAttribute('aria-selected')).eql('false');
    await t.expect(Selector('#neos-LinkEditor [role="tab"]').withExactText('Web').getAttribute('aria-selected')).eql('false');

    subSection('Select node target and save change');
    await t.expect(OpenLinkEditor.withText('Edit Link').exists).ok();

    await t.click(LinkEditorNodeTreeItem.withExactText('Link target'));

    await t.expect(WarningOrErrorTooltips.exists).notOk();
    await t.click(Selector('#neos-LinkEditor button').withExactText('Apply'));
    await t.click(Selector('#neos-Inspector-Apply').withExactText('Apply'));

    await Page.waitForIframeLoading();
    await t.switchToIframe('[name="neos-content-main"]');
    await t.expect(Selector('[data-link-editor-string]').innerText).eql(JSON.stringify('node://link-target'))
    await t.switchToMainWindow();

    subSection('Reopen and validate selected node');
    await t.click(LinkStringProperty.find('[title="Edit Link"]'));
    await t.expect(OpenLinkEditor.withText('Edit Link').exists).ok();
    await t.expect(Selector('#neos-LinkEditor [role="tab"]').withExactText('Document').getAttribute('aria-selected')).eql('true');
    await t.expect(LinkEditorNodeTreeItem.withExactText('Link target').parent('[role="button"][class*="_header__data--isActive"]').exists).ok();
    await t.expect(Selector('#neos-LinkEditor-Preview span').withExactText('Link target').exists).ok();
    await t.expect(Selector('#neos-LinkEditor-Preview span').withExactText('Home > Link editor > Link target').exists).ok();

    subSection('Select asset target with anchor and save change');
    await t.click(Selector('#neos-LinkEditor [role="tab"]').withExactText('Asset'));

    await t.typeText(Selector('#neos-LinkEditor label').withExactText('Anchor:').find('input'), 'my-anchor');
    await t.expect(Selector('#neos-LinkEditor button').withExactText('Apply').hasAttribute('disabled')).ok(); // anchor cannot be applied alone

    await t.switchToIframe(Selector('[name="neos-media-selection-screen"]', {timeout: 2000}))
        .click(Selector('.asset').withText('neos_primary.png'))
        .switchToMainWindow();

    await t.expect(WarningOrErrorTooltips.exists).notOk();
    await t.click(Selector('#neos-LinkEditor button').withExactText('Apply'));
    await t.click(Selector('#neos-Inspector-Apply').withExactText('Apply'));

    await Page.waitForIframeLoading();
    await t.switchToIframe('[name="neos-content-main"]');
    await t.expect(Selector('[data-link-editor-string]').innerText).eql(JSON.stringify('asset://ee3d239e-48b0-4f99-90be-054301b91792#my-anchor'))
    await t.switchToMainWindow();

    subSection('Reopen and validate selected asset');
    await t.click(LinkStringProperty.find('[title="Edit Link"]'));
    await t.expect(OpenLinkEditor.withText('Edit Link').exists).ok();
    await t.expect(Selector('#neos-LinkEditor [role="tab"]').withExactText('Asset').getAttribute('aria-selected')).eql('true');
    await t.expect(Selector('#neos-LinkEditor-Preview span').withExactText('neos_primary.png').exists).ok();
    await t.expect(Selector('#neos-LinkEditor-Preview img').getAttribute('src')).contains('neos_primary-');

    subSection('Select web target with anchor and save change');
    await t.click(Selector('#neos-LinkEditor [role="tab"]').withExactText('Web'));

    await t.typeText(Selector('#neos-LinkEditor [id="__neos__editor__property---LinkEditor:Web.href"]'), 'www.neos.io')
    await t.click(Selector('[role="button"]').withExactText('Format as http link?'))
    await t.typeText(Selector('#neos-LinkEditor [id="__neos__editor__property---LinkEditor:Web.href"]'), '#my-anchor')

    await t.expect(WarningOrErrorTooltips.exists).notOk();
    await t.click(Selector('#neos-LinkEditor button').withExactText('Apply'));
    await t.click(Selector('#neos-Inspector-Apply').withExactText('Apply'));

    await Page.waitForIframeLoading();
    await t.switchToIframe('[name="neos-content-main"]');
    await t.expect(Selector('[data-link-editor-string]').innerText).eql(JSON.stringify('https://www.neos.io#my-anchor'))
    await t.switchToMainWindow();

    subSection('Reopen and validate selected web link');
    await t.click(LinkStringProperty.find('[title="Edit Link"]'));
    await t.expect(OpenLinkEditor.withText('Edit Link').exists).ok();
    await t.expect(Selector('#neos-LinkEditor [role="tab"]').withExactText('Web').getAttribute('aria-selected')).eql('true');
    await t.expect(Selector('#neos-LinkEditor-Preview span').withExactText('https://www.neos.io#my-anchor').exists).ok();
    await t.expect(Selector('#neos-LinkEditor [id="__neos__editor__property---LinkEditor:Web.href"] input').value).eql('https://www.neos.io#my-anchor')

    subSection('Select mail to target and save change');
    await t.click(Selector('#neos-LinkEditor [role="tab"]').withExactText('Mail to'));

    await t.typeText(Selector('#neos-LinkEditor [id="__neos__editor__property---LinkEditor:MailTo.recipient"]'), 'mail@neos.io')
    await t.typeText(Selector('#neos-LinkEditor [id="__neos__editor__property---LinkEditor:MailTo.subject"]'), 'My Subject')
    await t.typeText(Selector('#neos-LinkEditor [id="__neos__editor__property---LinkEditor:MailTo.body"]'), 'My Body' + "\n\n" + 'Bye')

    await t.expect(WarningOrErrorTooltips.exists).notOk();
    await t.click(Selector('#neos-LinkEditor button').withExactText('Apply'));
    await t.click(Selector('#neos-Inspector-Apply').withExactText('Apply'));

    await Page.waitForIframeLoading();
    await t.switchToIframe('[name="neos-content-main"]');
    await t.expect(Selector('[data-link-editor-string]').innerText).eql(JSON.stringify('mailto:mail@neos.io?subject=My%20Subject&body=My%20Body%0A%0ABye'))
    await t.switchToMainWindow();

    subSection('Reopen and validate selected web link');
    await t.click(LinkStringProperty.find('[title="Edit Link"]'));
    await t.expect(OpenLinkEditor.withText('Edit Link').exists).ok();
    await t.expect(Selector('#neos-LinkEditor [role="tab"]').withExactText('Mail to').getAttribute('aria-selected')).eql('true');
    await t.expect(Selector('#neos-LinkEditor-Preview span').withExactText('mail@neos.io').exists).ok();
    await t.expect(Selector('#neos-LinkEditor-Preview span').withExactText('My Subject My Body Bye').exists).ok();

    await t.expect(Selector('#neos-LinkEditor [id="__neos__editor__property---LinkEditor:MailTo.recipient"]').value).eql('mail@neos.io');
    await t.expect(Selector('#neos-LinkEditor [id="__neos__editor__property---LinkEditor:MailTo.subject"]').value).eql('My Subject');
    await t.expect(Selector('#neos-LinkEditor [id="__neos__editor__property---LinkEditor:MailTo.body"]').value).eql('My Body' + "\n\n" + 'Bye');

    subSection('Select phone target and save change');
    await t.click(Selector('#neos-LinkEditor [role="tab"]').withExactText('Phone Number'));

    await t.typeText(Selector('#neos-LinkEditor [id="__neos__editor__property---LinkEditor:PhoneNumber.phoneNumber"]'), '+45123456789')

    await t.expect(WarningOrErrorTooltips.exists).notOk();
    await t.click(Selector('#neos-LinkEditor button').withExactText('Apply'));
    await t.click(Selector('#neos-Inspector-Apply').withExactText('Apply'));

    await Page.waitForIframeLoading();
    await t.switchToIframe('[name="neos-content-main"]');
    await t.expect(Selector('[data-link-editor-string]').innerText).eql(JSON.stringify('tel:+45123456789'))
    await t.switchToMainWindow();

    subSection('Reopen and validate selected phone number');
    await t.click(LinkStringProperty.find('[title="Edit Link"]'));
    await t.expect(OpenLinkEditor.withText('Edit Link').exists).ok();
    await t.expect(Selector('#neos-LinkEditor [role="tab"]').withExactText('Phone Number').getAttribute('aria-selected')).eql('true');
    await t.expect(Selector('#neos-LinkEditor-Preview span').withExactText('+45123456789').exists).ok();

    await t.expect(Selector('#neos-LinkEditor [id="__neos__editor__property---LinkEditor:PhoneNumber.phoneNumber"]').value).eql('+45123456789')

    subSection('Select node target with anchor and save change');
    await t.click(Selector('#neos-LinkEditor [role="tab"]').withExactText('Document'));

    await t.click(LinkEditorNodeTreeItem.withExactText('Link target'));

    await t.typeText(Selector('#neos-LinkEditor label').withExactText('Anchor:').find('input'), 'my-anchor')

    await t.expect(WarningOrErrorTooltips.exists).notOk();
    await t.click(Selector('#neos-LinkEditor button').withExactText('Apply'));
    await t.click(Selector('#neos-Inspector-Apply').withExactText('Apply'));

    await Page.waitForIframeLoading();
    await t.switchToIframe('[name="neos-content-main"]');
    await t.expect(Selector('[data-link-editor-string]').innerText).eql(JSON.stringify('node://link-target#my-anchor'))
    await t.switchToMainWindow();

    subSection('Value Object: Select node target and save change');
    await t.click(LinkObjectProperty.withText('Create Link'));

    await t.expect(OpenLinkEditor.withText('Edit Link').exists).ok();

    await t.click(LinkEditorNodeTreeItem.withExactText('Link target'));

    await t.expect(WarningOrErrorTooltips.exists).notOk();
    await t.click(Selector('#neos-LinkEditor button').withExactText('Apply'));
    await t.click(Selector('#neos-Inspector-Apply').withExactText('Apply'));

    await Page.waitForIframeLoading();
    await t.switchToIframe('[name="neos-content-main"]');
    await t.expect(Selector('[data-link-editor-object]').innerText).eql(JSON.stringify({"href":"node://link-target","title":null,"target":null,"rel":[],"download":false}))
    await t.switchToMainWindow();

    subSection('Value Object: Select node target with anchor, title, rel, target and save change');
    await t.click(LinkObjectProperty.find('[title="Edit Link"]'));

    await t.expect(OpenLinkEditor.withText('Edit Link').exists).ok();

    await t.click(LinkEditorNodeTreeItem.withExactText('Link target'));

    await t.typeText(Selector('#neos-LinkEditor label').withExactText('Anchor:').find('input'), 'my-anchor')

    await t.click(Selector('#neos-LinkEditor-Options'));

    await t.typeText(Selector('#neos-LinkEditor label').withExactText('Title:').find('input'), 'My title')
    await t.click(Selector('#neos-LinkEditor label').withExactText('Open in new window').find('input'))
    await t.click(Selector('#neos-LinkEditor label').withExactText('No follow (SEO)').find('input'))

    await t.expect(WarningOrErrorTooltips.exists).notOk();
    await t.click(Selector('#neos-LinkEditor button').withExactText('Apply'));
    await t.click(Selector('#neos-Inspector-Apply').withExactText('Apply'));

    await Page.waitForIframeLoading();
    await t.switchToIframe('[name="neos-content-main"]');
    await t.expect(Selector('[data-link-editor-object]').innerText).eql(JSON.stringify({"href":"node://link-target#my-anchor","title":"My title","target":"_blank","rel":["nofollow"],"download":false}))
    await t.switchToMainWindow();

    subSection('Value Object: Select web target with anchor, title, rel, target, download and save change');
    await t.click(LinkObjectProperty.find('[title="Edit Link"]'));

    await t.expect(OpenLinkEditor.withText('Edit Link').exists).ok();

    await t.click(Selector('#neos-LinkEditor [role="tab"]').withExactText('Web'));

    await t.typeText(Selector('#neos-LinkEditor [id="__neos__editor__property---LinkEditor:Web.href"]'), 'https://www.neos.io#my-anchor')

    await t.click(Selector('#neos-LinkEditor label').withExactText('No follow (SEO)').find('input'))

    await t.click(Selector('#neos-LinkEditor label').withExactText('Download target').find('input'))

    await t.expect(WarningOrErrorTooltips.exists).notOk();
    await t.click(Selector('#neos-LinkEditor button').withExactText('Apply'));
    await t.click(Selector('#neos-Inspector-Apply').withExactText('Apply'));

    await Page.waitForIframeLoading();
    await t.switchToIframe('[name="neos-content-main"]');
    await t.expect(Selector('[data-link-editor-object]').innerText).eql(JSON.stringify({"href":"https://www.neos.io#my-anchor","title":"My title","target":"_blank","rel":[],"download":true}))
    await t.switchToMainWindow();
});

test('PageTree search and filter in link editor document selection', async t => {
    await Page.goToPage('Link editor')
    await t.click(Selector('#neos-ContentTree-ToggleContentTree'));
    await t.click(Page.treeNode.withText('LinkEditor_Test'));

    await t.click(LinkStringProperty.withExactText('Create Link'));

    subSection('Search the page tree');
    const seachTerm = 'Searchme';
    const notSearchedPage = 'Not searched page';
    const notSearchedShortcut = 'Not searched shortcut';
    const searchmePage = 'Searchme page';
    const searchmeShortcut = 'Searchme shortcut';

    const nodeTreeSearchInput = ReactSelector('DialogWithOverlay SearchInput');
    const nodeTreeFilter = ReactSelector('DialogWithOverlay SelectNodeTypeFilter');
    const shortcutFilter = ReactSelector('DialogWithOverlay SelectNodeTypeFilter ContextDropDownContents').find('li').withText('Shortcut');
    await t
        .typeText(nodeTreeSearchInput, seachTerm)
        .expect(LinkEditorNodeTreeItem.withText(seachTerm).count).eql(2, 'Two "Searchme" nodes should be found, one shortcut and one normal page')
        .expect(LinkEditorNodeTreeItem.withText(notSearchedPage).exists).notOk('Other unsearched page should be hidden ');

    subSection('Set the Shortcut filter');
    await t
        .click(nodeTreeFilter)
        .click(shortcutFilter)
        .expect(LinkEditorNodeTreeItem.withText(searchmeShortcut).count).eql(1, 'Only one "Searchme" page should be found, of type Shortcut')
        .expect(LinkEditorNodeTreeItem.withText(searchmePage).exists).notOk('No matching "Shortcut" pages should be hidden')
        .expect(LinkEditorNodeTreeItem.withText(notSearchedPage).exists).notOk('Other unsearched page should still be hidden');

    subSection('Clear search');
    const clearSearch = ReactSelector('DialogWithOverlay SearchInput IconButton');
    await t
        .click(clearSearch)
        .expect(LinkEditorNodeTreeItem.withText(notSearchedShortcut).exists).ok('All "Shortcut" pages should be found')
        .expect(LinkEditorNodeTreeItem.withText(notSearchedPage).exists).notOk('Other unsearched page should still be hidden');

    subSection('Clear filter');
    const clearFilter = ReactSelector('DialogWithOverlay SelectNodeTypeFilter IconButton');
    await t
        .click(clearFilter)
        .expect(LinkEditorNodeTreeItem.withText(notSearchedPage).exists).ok('Other unsearched page should shown again');
});
