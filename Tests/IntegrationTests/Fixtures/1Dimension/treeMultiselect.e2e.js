import {ReactSelector} from 'testcafe-react-selectors';
import {beforeEach, checkPropTypes} from './../../utils.js';
import {Page} from './../../pageModel';

/* global fixture:true */

fixture`Tree multiselect`
    .beforeEach(beforeEach)
    .afterEach(() => checkPropTypes());

test('Move multiple nodes via toolbar', async t => {

    await t
        .click(Page.getTreeNodeButton('MultiB'))
        .click(Page.getTreeNodeButton('MultiD'), {
            modifiers: {
                ctrl: true
            }
        })
        .click('#neos-PageTree-CutSelectedNode')
        .click(Page.getTreeNodeButton('MultiA'))
        .click('#neos-PageTree-PasteClipBoardNode')
        .click(ReactSelector('InsertModeSelector').find('#into'))
        .click('#neos-InsertModeModal-apply')
        .click(Page.getTreeNodeButton('MultiB'))
        .expect(ReactSelector('Provider').getReact(({props}) => {
            const reduxState = props.store.getState();
            return reduxState.cr.nodes.documentNode;
        })).eql('user-admin__eyJsYW5ndWFnZSI6ImVuX1VTIn0=__5b0d6ac0-40ab-47e8-b79e-39de6c0700df', 'Node B\'s node address changed');
    await t.click(Page.getTreeNodeButton('Home'))
});

test('Move multiple nodes via DND, CMD-click', async t => {
    await t
        .click(Page.getTreeNodeButton('MultiB'))
        .click(Page.getTreeNodeButton('MultiD'), {
            modifiers: {
                ctrl: true
            }
        })
        .dragToElement(Page.getTreeNodeButton('MultiB'), Page.treeNode.withExactText('MultiA'))
        .click(Page.getTreeNodeButton('MultiB'))
        .expect(ReactSelector('Provider').getReact(({props}) => {
            const reduxState = props.store.getState();
            return reduxState.cr.nodes.documentNode;
        })).eql('user-admin__eyJsYW5ndWFnZSI6ImVuX1VTIn0=__5b0d6ac0-40ab-47e8-b79e-39de6c0700df', 'Node B\'s node address changed');
    await t.click(Page.getTreeNodeButton('Home'))
});

test('Move multiple nodes via DND, SHIFT-click', async t => {
    await t
        .click(Page.getTreeNodeButton('MultiB'))
        .click(Page.getTreeNodeButton('MultiD'), {
            modifiers: {
                shift: true
            }
        })
        .dragToElement(Page.getTreeNodeButton('MultiC'), Page.treeNode.withExactText('MultiA'))
        .click(Page.getTreeNodeButton('MultiC'))
        .expect(ReactSelector('Provider').getReact(({props}) => {
            const reduxState = props.store.getState();
            return reduxState.cr.nodes.documentNode;
        })).eql('user-admin__eyJsYW5ndWFnZSI6ImVuX1VTIn0=__84eb0340-ba34-4fdb-98b1-da503f967121', 'Node C\'s node address changed');
    await t.click(Page.getTreeNodeButton('Home'))
});
