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
        })).eql('/sites/neos-test-site/node-knm2pltb5454z/node-18qsaeidy6765/node-e8tw6sparbtp3@user-admin;language=en_US', 'Node B\'s context path changed');
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
        })).eql('/sites/neos-test-site/node-knm2pltb5454z/node-18qsaeidy6765/node-e8tw6sparbtp3@user-admin;language=en_US', 'Node B\'s context path changed');
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
        })).eql('/sites/neos-test-site/node-knm2pltb5454z/node-18qsaeidy6765/node-oml0cxaompt29@user-admin;language=en_US', 'Node C\'s context path changed');
    await t.click(Page.getTreeNodeButton('Home'))
});
