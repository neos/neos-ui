import {beforeEach, checkPropTypes} from './../../utils.js';
import {Page, PublishDropDown} from './../../pageModel';
import { Selector } from 'testcafe';

/* global fixture:true */

//
// Original Issue: https://github.com/neos/neos-ui/issues/3184
//
fixture`FIX #3184: Discarded node move changes are reflected correctly in the document tree`
    .beforeEach(beforeEach)
    .afterEach(() => checkPropTypes());

//
// This is an excerpt of the document tree in our E2E test distribution,
// stripped down to only show the relevant document nodes for this test
// scenario:
//
//   🗋 Home
//   ├─ 🗋 Discarding
//   └─ 🗋 Tree multiselect
//      ├─ 🗋 MultiA
//      ├─ 🗋 MultiB
//      └─ 🗋 MultiC
//
// In reference to that hierarchy, we're putting some selectors into variables
// for later use in the concrete test cases, so we don't have to repeat the
// long form over and over:
//
const Discarding = Page.getTreeNodeButton('Discarding');
const MultiA = Page.getTreeNodeButton('MultiA');
const MultiB = Page.getTreeNodeButton('MultiB');
const MultiC = Page.getTreeNodeButton('MultiC');
const withCmdClick = {
    modifiers: {
        ctrl: true
    }
};

test(
    'Scenario #1: Moving nodes and then discarding that change does not lead to an error',
    async t => {
        //
        // Select 🗋 MultiA and 🗋 MultiB, then drag both documents INTO 🗋 MultiC.
        //
        await t
            .click(MultiA)
            .click(MultiB, withCmdClick)
            .dragToElement(MultiA, MultiC);

        //
        // Discard that change.
        //
        await PublishDropDown.discardAll();

        //
        // Assert that no error flash message shows up.
        //
        await t
            .expect(Selector('[role="alert"][class*="error"]').exists)
            .notOk();
    }
);

test(
    'Scenario #2: Moved nodes do not just disappear after discarding the move change',
    async t => {
        //
        // Select 🗋 MultiA and 🗋 MultiB, then drag both documents INTO 🗋 Discarding.
        //
        await t
            .click(MultiA)
            .click(MultiB, withCmdClick)
            .dragToElement(MultiA, Discarding);

        //
        // Go to 🗋 Tree multiselect, so we can check for stale metadata
        // coming from the guest frame.
        // We also need to reload to avoid Scenario #1.
        //
        await Page.goToPage('Tree multiselect');
        await t.eval(() => location.reload(true));
        await Page.waitForIframeLoading();

        //
        // Discard the move change and wait for the guest frame to reload plus
        // some extra timeout, so there's a chance for stale metadata to
        // overwrite the tree state.
        //
        await PublishDropDown.discardAll();
        await Page.waitForIframeLoading();
        await t.wait(500);

        //
        // Assert that 🗋 MultiA and 🗋 MultiB can still be found.
        //
        await t
            .expect(MultiA.exists)
            .ok('🗋 MultiA has disappeared');
        await t
            .expect(MultiB.exists)
            .ok('🗋 MultiB has disappeared');
    }
)

test(
    'Scenario #3: Discarding a move change while being on a moved node does not'
    + ' lead to an error in the guest frame',
    async t => {
        //
        // Select 🗋 MultiA and 🗋 MultiB, then drag both documents INTO 🗋 MultiC.
        //
        await t
            .click(MultiA)
            .click(MultiB, withCmdClick)
            .dragToElement(MultiA, MultiC);

        //
        // Go to 🗋 Home and reload the backend, so we avoid Scenario #1's
        // underlying issue.
        //
        await Page.goToPage('Home');
        await t.eval(() => location.reload(true));

        //
        // Go to 🗋 MultiA, so we are on a moved node in the guest frame.
        //
        await Page.goToPage('MultiA');

        //
        // Discard the move change.
        //
        await PublishDropDown.discardAll();

        //
        // Assert that there's no error showing up in the guest frame and
        // that we're instead seeing the next-higher document node.
        //
        await Page.waitForIframeLoading();
        await t.switchToIframe('[name="neos-content-main"]');
        await t
            .expect(Selector('.neos-error-screen').exists)
            .notOk('There\'s an unexpected error screen in the guest frame.');

        await t.switchToMainWindow();
        await t
            .expect(Selector('[role="treeitem"] [role="button"][class*="isFocused"]').textContent)
            .eql('MultiA');
    }
);
