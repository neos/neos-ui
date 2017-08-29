import {Selector, Role, ClientFunction} from 'testcafe';
import ReactSelector from 'testcafe-react-selectors';

const handleErrors = ClientFunction(() => {
    console.error = msg => {
        throw new Error(msg);
    };
});

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
        await handleErrors();
    });

test('Can open node creation dialog', async t => {
    const AddNodeButton = ReactSelector('AddNode Button');
    const SelectNodeTypeModal = ReactSelector('SelectNodeType');
    await t.expect(SelectNodeTypeModal.exists).ok();
    await t.expect(SelectNodeTypeModal.getReact(({props}) => props.isOpen)).eql(false);
    await t.click(AddNodeButton);
    await t.expect(SelectNodeTypeModal.getReact(({props}) => props.isOpen)).eql(true);
});
test('Can toggle leftSideBar', async t => {
    const leftSideBarToggler = ReactSelector('LeftSideBarToggler Button');
    const leftSideBar = ReactSelector('LeftSideBar');
    await t.expect(leftSideBar.getReact(({props}) => props.isHidden)).eql(false);
    await t.click(leftSideBarToggler);
    await t.expect(leftSideBar.getReact(({props}) => props.isHidden)).eql(true);
});
test('Can toggle rightSideBar', async t => {
    const rightSideBarToggler = ReactSelector('RightSideBar Button');
    const rightSideBar = ReactSelector('RightSideBar');
    await t.expect(rightSideBar.getReact(({props}) => props.isHidden)).eql(false);
    await t.click(rightSideBarToggler);
    await t.expect(rightSideBar.getReact(({props}) => props.isHidden)).eql(true);
});
