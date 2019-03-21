import {ReactSelector} from 'testcafe-react-selectors';
import {beforeEach, subSection, checkPropTypes} from './../../utils.js';

/* global fixture:true */

fixture`Discarding`
    .beforeEach(beforeEach)
    .afterEach(() => checkPropTypes());

test('Can toggle sidebars', async t => {
    subSection('LeftSideBar');
    const leftSideBarToggler = ReactSelector('LeftSideBarToggler Button');
    const leftSideBar = ReactSelector('LeftSideBar');
    await t
        .expect(leftSideBar.getReact(({props}) => props.isHidden)).eql(false)
        .click(leftSideBarToggler)
        .expect(leftSideBar.getReact(({props}) => props.isHidden)).eql(true)
        .click(leftSideBarToggler)
        .expect(leftSideBar.getReact(({props}) => props.isHidden)).eql(false);

    subSection('RightSideBar');
    const rightSideBarToggler = ReactSelector('RightSideBar Button');
    const rightSideBar = ReactSelector('RightSideBar');
    await t
        .expect(rightSideBar.getReact(({props}) => props.isHidden)).eql(false)
        .click(rightSideBarToggler)
        .expect(rightSideBar.getReact(({props}) => props.isHidden)).eql(true)
        .click(rightSideBarToggler)
        .expect(rightSideBar.getReact(({props}) => props.isHidden)).eql(false);
});
