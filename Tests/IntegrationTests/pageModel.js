import {t, Selector} from 'testcafe';
import {ReactSelector} from 'testcafe-react-selectors';

//
// We define all methods as static here so it would be possible to use these classes without `new`
//
export class Page {
    // FIXME: The ReactSelector for `Node` didn't work here anymore since TestCafe was updated but should be used instead
    static treeNode = Selector('[data-neos-integrational-test="tree__item__nodeHeader__itemLabel"]');

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
}

export class PublishDropDown {
    static publishDropdown = Selector('#neos-PublishDropDown-Toggle > [role="button"]');

    static publishDropdownDiscardAll = Selector('#neos-PublishDropDown-DiscardAll');

    static async discardAll() {
        await t
            .click(this.publishDropdown)
            .click(this.publishDropdownDiscardAll);
        const confirmButtonExists = await Selector('#neos-DiscardDialog-Confirm').exists;
        if (confirmButtonExists) {
            await t.click(Selector('#neos-DiscardDialog-Confirm'));
        }
        await Page.waitForIframeLoading();
    }
}

export class Inspector {
    static async getInspectorEditor(propertyName) {
        return ReactSelector('InspectorEditorEnvelope').withProps('id', propertyName);
    }
}
