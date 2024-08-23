import {t, Selector} from 'testcafe';
import {ReactSelector} from 'testcafe-react-selectors';

//
// We define all methods as static here so it would be possible to use these classes without `new`
//
export class Page {
    static treeNode = ReactSelector('Node').find('a');

    static getTreeNodeButton = (name) => Page.treeNode.withExactText(name).parent('[role="button"]');

    static getToggleChildrenButtonOf = (name) => Page
        .getTreeNodeButton(name)
        .sibling('[data-neos-integrational-test="tree__item__nodeHeader__subTreetoggle"]');

    static async goToPage(pageTitle) {
        await t.click(this.treeNode.withText(pageTitle));
        await this.waitForIframeLoading(t);
    }

    static async getReduxState(selector) {
        const reduxState = await ReactSelector('Provider').getReact(({props}) => {
            return props.store.getState();
        });
        return selector(reduxState);
    }

    static async waitForIframeLoading() {
        await t.expect(ReactSelector('Provider').getReact(({props}) => {
            const reduxState = props.store.getState();
            return !reduxState.ui.contentCanvas.isLoading;
        })).ok('Loading stopped');
    }
}

export class DimensionSwitcher {
    static dimensionSwitcher = ReactSelector('DimensionSwitcher');

    static dimensionSwitcherFirstDimensionSelector = ReactSelector('DimensionSwitcher SelectBox');

    static dimensionSwitcherFirstDimensionSelectorWithShallowDropDownContents = ReactSelector('DimensionSwitcher SelectBox ShallowDropDownContents');

    static async switchLanguageDimension(name) {
        await t
            .click(this.dimensionSwitcher)
            .click(this.dimensionSwitcherFirstDimensionSelector)
            .click(this.dimensionSwitcherFirstDimensionSelectorWithShallowDropDownContents.find('li').withText(name));
    }

    static async switchSingleDimension(name) {
        await t
            .click(this.dimensionSwitcher)
            .click(ReactSelector('DimensionSelectorOption').withProps('option', {label: name}));
    }
}

export class PublishDropDown {
    static publishDropdown = ReactSelector('PublishDropDown ContextDropDownHeader');

    static publishDropdownDiscardAll = ReactSelector('PublishDropDown ShallowDropDownContents').find('button').withText('Discard all');

    static publishDropdownPublishAll = ReactSelector('PublishDropDown ShallowDropDownContents').find('button').withText('Publish all');

    static async discardAll() {
        const $discardAllBtn = Selector(this.publishDropdownDiscardAll);
        const $confirmBtn = Selector('#neos-DiscardDialog-Confirm');
        const $acknowledgeBtn = Selector('#neos-DiscardDialog-Acknowledge');

        await t.click(this.publishDropdown)
        await t.expect($discardAllBtn.exists)
            .ok('"Discard all" button is not available.');

        if (await $discardAllBtn.hasAttribute('disabled')) {
            return;
        }

        await t.click($discardAllBtn);
        await t.expect($confirmBtn.exists)
            .ok('Confirmation button for "Discard all" is not available.');
        await t.click($confirmBtn);
        await t.expect($acknowledgeBtn.exists)
            .ok('Acknowledge button for "Discard all" is not available.', {
                timeout: 30000
            });
        await t.click($acknowledgeBtn);
    }

    static async publishAll() {
        const $publishAllBtn = Selector(this.publishDropdownPublishAll);
        const $confirmBtn = Selector('#neos-PublishDialog-Confirm');
        const $acknowledgeBtn = Selector('#neos-PublishDialog-Acknowledge');

        await t.click(this.publishDropdown)
        await t.expect($publishAllBtn.exists)
            .ok('"Publish all" button is not available.');

        if (await $publishAllBtn.hasAttribute('disabled')) {
            return;
        }

        await t.click($publishAllBtn);
        await t.expect($confirmBtn.exists)
            .ok('Confirmation button for "Publish all" is not available.');
        await t.click($confirmBtn);
        await t.expect($acknowledgeBtn.exists)
            .ok('Acknowledge button for "Publish all" is not available.', {
                timeout: 30000
            });
        await t.click($acknowledgeBtn);
    }
}

export class Inspector {
    static async getInspectorEditor(propertyName) {
        return ReactSelector('InspectorEditorEnvelope').withProps('id', propertyName);
    }
}
