import {Selector} from 'testcafe';
import {ReactSelector} from 'testcafe-react-selectors';
import {adminUser, subSection, checkPropTypes} from './../../utils.js';
import Page from './../../pageModel';

/* global fixture:true */
/* eslint babel/new-cap: 0 */
export const page = new Page();

fixture`Discarding`
    .beforeEach(async t => {
        await t.useRole(adminUser);
        await page.discardAll();
        await page.goToPage('Home');
    })
    .afterEach(() => checkPropTypes());

test('Discarding: create multiple nodes nested within each other and then discard them', async t => {
    const pageTitleToCreate = 'DiscardTest';
    subSection('Create a document node');
    await t
        .click(Selector('#neos-PageTree-AddNode'))
        .click(ReactSelector('InsertModeSelector').find('#into'))
        .click(ReactSelector('NodeTypeItem'))
        .typeText(Selector('#neos-NodeCreationDialog-Body input'), pageTitleToCreate)
        .click(Selector('#neos-NodeCreationDialog-CreateNew'));
    await page.waitForIframeLoading();

    subSection('Create another node inside it');
    await t
        .click(Selector('#neos-PageTree-AddNode'))
        .click(ReactSelector('InsertModeSelector').find('#into'))
        .click(ReactSelector('NodeTypeItem'))
        .typeText(Selector('#neos-NodeCreationDialog-Body input'), pageTitleToCreate)
        .click(Selector('#neos-NodeCreationDialog-CreateNew'));
    await page.waitForIframeLoading();

    subSection('Discard all nodes and hope to be redirected to root');
    await page.discardAll();
    await t
        .expect(ReactSelector('Provider').getReact(({props}) => {
            const reduxState = props.store.getState();
            return reduxState.cr.nodes.documentNode;
        })).eql('/sites/site@user-admin;language=en_US', 'After discarding we are back to the main page');
});
