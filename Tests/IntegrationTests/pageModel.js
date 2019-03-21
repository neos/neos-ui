import {t, Selector} from 'testcafe';
import {ReactSelector} from 'testcafe-react-selectors';

class DimensionSwitcher {
    constructor() {
        this.dimensionSwitcher = ReactSelector('DimensionSwitcher');
        this.dimensionSwitcherFirstDimensionSelector = ReactSelector('DimensionSwitcher SelectBox');
    }

    async switchLanguageDimension(name) {
        await t
            .click(this.dimensionSwitcher)
            .click(this.dimensionSwitcherFirstDimensionSelector)
            .click(this.dimensionSwitcherFirstDimensionSelector.find('li').withText(name));
    }
}

class PublishDropDown {
    constructor() {
        this.publishDropdown = ReactSelector('PublishDropDown ContextDropDownHeader');
        this.publishDropdownDiscardAll = ReactSelector('PublishDropDown ShallowDropDownContents').find('button').withText('Discard all');
    }

    async discardAll() {
        await t
            .click(this.publishDropdown)
            .click(this.publishDropdownDiscardAll);
    }
}

export default class Page {
    constructor() {
        this.dimensionSwitcher = new DimensionSwitcher();
        this.publishDropdown = new PublishDropDown();
        this.treeNode = ReactSelector('Node').find('span');
    }

    async getReduxState(selector) {
        const reduxState = await ReactSelector('Provider').getReact(({props}) => {
            return props.store.getState();
        });
        return selector(reduxState);
    }

    async waitForIframeLoading() {
        await t.expect(ReactSelector('Provider').getReact(({props}) => {
            const reduxState = props.store.getState();
            return !reduxState.ui.contentCanvas.isLoading;
        })).ok('Loading stopped');
    }

    async goToPage(pageTitle) {
        await t.click(this.treeNode.withText(pageTitle));
        await this.waitForIframeLoading(t);
    }

    async discardAll() {
        await this.publishDropdown.discardAll();
        const confirmButtonExists = await Selector('#neos-DiscardDialog-Confirm').exists;
        if (confirmButtonExists) {
            await t.click(Selector('#neos-DiscardDialog-Confirm'));
        }
        await this.waitForIframeLoading();
    }

    async switchLanguageDimension(name) {
        await this.dimensionSwitcher.switchLanguageDimension(name);
    }
}
