import {Role} from 'testcafe';
import ReactSelector from 'testcafe-react-selectors';

/* global fixture:true */
/* eslint babel/new-cap: 0 */

const adminUrl = 'http://127.0.0.1:8081/neos!';

const adminUser = Role(adminUrl, async t => {
    await t
        .typeText('#username', 'admin')
        .typeText('#password', 'password')
        .click('button.neos-login-btn');
}, {preserveUrl: true});

fixture `ContentCanvas`
    .beforeEach(async t => {
        await t.useRole(adminUser);
    });

// TODO: split tests when it's possible to skip authentication
test('All tests at once', async t => {
    console.log('Can toggle leftSideBar');
    const leftSideBarToggler = ReactSelector('LeftSideBarToggler Button');
    const leftSideBar = ReactSelector('LeftSideBar');
    await t.expect(leftSideBar.getReact(({props}) => props.isHidden)).eql(false);
    await t.click(leftSideBarToggler);
    await t.expect(leftSideBar.getReact(({props}) => props.isHidden)).eql(true);
    await t.click(leftSideBarToggler);
    await t.expect(leftSideBar.getReact(({props}) => props.isHidden)).eql(false);

    console.log('Can toggle rightSideBar');
    const rightSideBarToggler = ReactSelector('RightSideBar Button');
    const rightSideBar = ReactSelector('RightSideBar');
    await t.expect(rightSideBar.getReact(({props}) => props.isHidden)).eql(false);
    await t.click(rightSideBarToggler);
    await t.expect(rightSideBar.getReact(({props}) => props.isHidden)).eql(true);
    await t.click(rightSideBarToggler);
    await t.expect(rightSideBar.getReact(({props}) => props.isHidden)).eql(false);

    console.log('Can open node creation dialog');
    const SelectNodeTypeModal = ReactSelector('SelectNodeType');
    await t.expect(SelectNodeTypeModal.exists).ok();
    await t.expect(SelectNodeTypeModal.getReact(({props}) => props.isOpen)).eql(false);
    await t.click(ReactSelector('AddNode Button'));
    await t.expect(SelectNodeTypeModal.getReact(({props}) => props.isOpen)).eql(true);
    await t.click(ReactSelector('NodeTypeItem'));
    await t.click(ReactSelector('BackButton'));
    await t.click(ReactSelector('NodeTypeItem'));
    await t.typeText(ReactSelector('NodeCreationDialogBody TextField').find('input'), 'TestPage');
    await t.click(ReactSelector('CreateButton'));
    await t.expect(ReactSelector('NodeCreationDialog').getReact(({props}) => props.isOpen)).eql(false);
});
