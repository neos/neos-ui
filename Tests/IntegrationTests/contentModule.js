import {Selector, Role} from 'testcafe';
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
    await t
        .expect(leftSideBar.getReact(({props}) => props.isHidden)).eql(false)
        .click(leftSideBarToggler)
        .expect(leftSideBar.getReact(({props}) => props.isHidden)).eql(true)
        .click(leftSideBarToggler)
        .expect(leftSideBar.getReact(({props}) => props.isHidden)).eql(false);

    console.log('Can toggle rightSideBar');
    const rightSideBarToggler = ReactSelector('RightSideBar Button');
    const rightSideBar = ReactSelector('RightSideBar');
    await t
        .expect(rightSideBar.getReact(({props}) => props.isHidden)).eql(false)
        .click(rightSideBarToggler)
        .expect(rightSideBar.getReact(({props}) => props.isHidden)).eql(true)
        .click(rightSideBarToggler)
        .expect(rightSideBar.getReact(({props}) => props.isHidden)).eql(false);

    console.log('Can create a new page');
    const SelectNodeTypeModal = ReactSelector('SelectNodeType');
    const newPageTitle = 'TestPage';
    await t
        .expect(SelectNodeTypeModal.exists).ok()
        .expect(SelectNodeTypeModal.getReact(({props}) => props.isOpen)).eql(false)
        .click(ReactSelector('AddNode Button'))
        .expect(SelectNodeTypeModal.getReact(({props}) => props.isOpen)).eql(true)
        .click(ReactSelector('NodeTypeItem'))
        .click(ReactSelector('BackButton'))
        .click(ReactSelector('NodeTypeItem'))
        .typeText(ReactSelector('NodeCreationDialogBody TextField').find('input'), newPageTitle)
        .click(ReactSelector('CreateButton'))
        .expect(ReactSelector('NodeCreationDialog').getReact(({props}) => props.isOpen)).eql(false);
    await t
        .switchToIframe('[name="neos-content-main"]')
        .expect(Selector('li').withText(newPageTitle).exists).ok()
        .switchToMainWindow();
});
