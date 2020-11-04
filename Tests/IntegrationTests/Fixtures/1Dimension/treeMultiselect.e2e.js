import {ReactSelector} from 'testcafe-react-selectors';
import {beforeEach, checkPropTypes} from './../../utils.js';
import {Page} from './../../pageModel';

/* global fixture:true */

fixture`Tree multiselect`
    .beforeEach(beforeEach)
    .afterEach(() => checkPropTypes());

test('Move multiple nodes via toolbar', async t => {
    await t
        .click(Page.treeNode.withExactText('MultiB'))
        .expect(ReactSelector('Provider').getReact(({props}) => {
            const reduxState = props.store.getState();
            return reduxState.cr.nodes.documentNode;
        })).eql('/sites/neos-test-site/node-knm2pltb5454z/node-e8tw6sparbtp3@user-admin;language=en_US', 'Check original context path of Node B')
        .click(Page.treeNode.withExactText('MultiD'), {
            modifiers: {
                ctrl: true
            }
        })
        .click('#neos-PageTree-CutSelectedNode')
        .click(Page.treeNode.withExactText('MultiA'))
        .click('#neos-PageTree-PasteClipBoardNode')
        .click(ReactSelector('InsertModeSelector').find('#into'))
        .click('#neos-InsertModeModal-apply')
        .click(Page.treeNode.withExactText('MultiB'))
        .expect(ReactSelector('Provider').getReact(({props}) => {
            const reduxState = props.store.getState();
            return reduxState.cr.nodes.documentNode;
        })).eql('/sites/neos-test-site/node-knm2pltb5454z/node-18qsaeidy6765/node-e8tw6sparbtp3@user-admin;language=en_US', 'Node B\'s context path changed');
    await t.click(Page.treeNode.withExactText('Home'))
});

test('Move multiple nodes via DND, CMD-click', async t => {
    await t
        .click(Page.treeNode.withExactText('MultiB'))
        .click(Page.treeNode.withExactText('MultiD'), {
            modifiers: {
                ctrl: true
            }
        })
        .dragToElement(Page.treeNode.withExactText('MultiB'), Page.treeNode.withExactText('MultiA'))
        .click(Page.treeNode.withExactText('MultiB'))
        .expect(ReactSelector('Provider').getReact(({props}) => {
            const reduxState = props.store.getState();
            return reduxState.cr.nodes.documentNode;
        })).eql('/sites/neos-test-site/node-knm2pltb5454z/node-18qsaeidy6765/node-e8tw6sparbtp3@user-admin;language=en_US', 'Node B\'s context path changed');
    await t.click(Page.treeNode.withExactText('Home'))
});

test('Move multiple nodes via DND, SHIFT-click', async t => {
    await t
        .click(Page.treeNode.withExactText('MultiB'))
        .click(Page.treeNode.withExactText('MultiD'), {
            modifiers: {
                shift: true
            }
        })
        .dragToElement(Page.treeNode.withExactText('MultiC'), Page.treeNode.withExactText('MultiA'))
        .click(Page.treeNode.withExactText('MultiC'))
        .expect(ReactSelector('Provider').getReact(({props}) => {
            const reduxState = props.store.getState();
            return reduxState.cr.nodes.documentNode;
        })).eql('/sites/neos-test-site/node-knm2pltb5454z/node-18qsaeidy6765/node-oml0cxaompt29@user-admin;language=en_US', 'Node C\'s context path changed');
    await t.click(Page.treeNode.withExactText('Home'))
});
