import {Selector} from 'testcafe';
import {beforeEach, subSection, checkPropTypes} from '../../utils';
import {Page} from '../../pageModel';
import {ReactSelector} from 'testcafe-react-selectors';

/* global fixture:true */

fixture`Inspector`.beforeEach(beforeEach).afterEach(() => checkPropTypes());

test('Can edit the page title via inspector', async t => {
    const InspectorTitleProperty = Selector(
        '#__neos__editor__property---title'
    );
    const InspectorUriPathSegmentProperty = Selector(
        '#__neos__editor__property---uriPathSegment'
    );
    await Page.waitForIframeLoading(t);

    subSection('Rename home page via inspector');
    await t
        .expect(InspectorTitleProperty.value)
        .eql('Home')
        .expect(InspectorUriPathSegmentProperty.value)
        .eql('home')
        .click(InspectorTitleProperty)
        .typeText(InspectorTitleProperty, '-привет!')
        .expect(InspectorTitleProperty.value)
        .eql('Home-привет!')
        .wait(200)
        .click(Selector('#neos-UriPathSegmentEditor-sync'))
        .expect(InspectorUriPathSegmentProperty.value)
        .eql('home-privet')
        .click(Selector('#neos-Inspector-Discard'))
        .expect(InspectorTitleProperty.value)
        .eql('Home')
        .typeText(InspectorTitleProperty, '-1')
        .click(Selector('#neos-Inspector-Apply'))
        .expect(InspectorTitleProperty.value)
        .eql('Home-1');
    await Page.waitForIframeLoading(t);
    await t.expect(InspectorTitleProperty.value).eql('Home-1');

    subSection('Test unapplied changes dialog - resume');
    await t
        .click(InspectorTitleProperty)
        .typeText(InspectorTitleProperty, '-2')
        .click(Selector('#neos-Inspector'), {offsetX: -400}) // hack to click into the iframe even with overlaying changes div in dom
        .expect(Selector('#neos-UnappliedChangesDialog').exists)
        .ok()
        .click(Selector('#neos-UnappliedChangesDialog-resume'))
        .expect(Selector('#neos-UnappliedChangesDialog').exists)
        .notOk()
        .expect(InspectorTitleProperty.value)
        .eql('Home-1-2');

    subSection('Test unapplied changes dialog - discard');
    await t
        .click(Selector('#neos-Inspector'), {offsetX: -400}) // hack to click into the iframe even with overlaying changes div in dom
        .click(Selector('#neos-UnappliedChangesDialog-discard'))
        .expect(InspectorTitleProperty.value)
        .eql('Home-1');

    subSection('Test unapplied changes dialog - apply');
    await t
        .typeText(InspectorTitleProperty, '-3')
        .click(Selector('#neos-Inspector'), {offsetX: -400}) // hack to click into the iframe even with overlaying changes div in dom
        .click(Selector('#neos-UnappliedChangesDialog-apply'))
        .expect(InspectorTitleProperty.value)
        .eql('Home-1-3')
        .click(Selector('#neos-Inspector'), {offsetX: -400}) // hack to click into the iframe even with overlaying changes div in dom
        .expect(Selector('#neos-UnappliedChangesDialog').exists)
        .notOk();
});

test('Check ClientEval for dependencies between properties of NodeTypes in Inspector', async t => {
    await t
        .click(Selector('#neos-ContentTree-ToggleContentTree'))
        .click(Page.treeNode.withText('Content Collection (main)'))
        .click(Selector('#neos-ContentTree-AddNode'))
        .click(ReactSelector('NodeTypeItem').find('button>span>span').withText('NodeWithDependingProperties_Test'))

    // WHY: Some NodeTypes trigger a Node Creation Dialog
    const isCreationDialogOpen = await Selector('#neos-NodeCreationDialog-CreateNew').exists;
    if (isCreationDialogOpen) {
        await t.click(Selector('#neos-NodeCreationDialog-CreateNew'))
    }

    await Page.waitForIframeLoading(t)
    await t.wait(2000) // maybe we should wait for the loading state to finish instead of fixed number of seconds

    const propertyDependedOnSelectBoxSelector = ReactSelector('SelectBoxEditor')
        .withProps('identifier', 'propertyDependedOn')
        .findReact('SelectBox')

    const propertyDependedOnSelectBox = await propertyDependedOnSelectBoxSelector.getReact()

    const dependingPropertySelectBoxSelector = ReactSelector('SelectBoxEditor')
        .withProps('identifier', 'dependingProperty')
        .findReact('SelectBox')

    const dependingPropertySelectBox = await dependingPropertySelectBoxSelector.getReact()

    await t
        .expect(propertyDependedOnSelectBox.props.value).eql('odd')
        .expect(propertyDependedOnSelectBox.props.options).eql([
            {'label': 'odd', value: 'odd'},
            {'label': 'even', value: 'even'}
        ])

    await t
        .expect(dependingPropertySelectBox.props.value).eql(null)
        .expect(dependingPropertySelectBox.props.options).eql([
            {label: 'label_1', value: 1},
            {label: 'label_3', value: 3},
            {label: 'label_5', value: 5},
            {label: 'label_7', value: 7},
            {label: 'label_9', value: 9}
        ])

    await t.click(propertyDependedOnSelectBoxSelector)
    await t
        .click(Selector('span').withText('even'))
        .wait(2000) // TODO: maybe we should wait for the loading state to finish instead of fixed number of seconds

    const newPropertyDependedOnSelectBoxValue = (await propertyDependedOnSelectBoxSelector.getReact()).props.value
    const newDependingPropertySelectBoxOptions = (await dependingPropertySelectBoxSelector.getReact()).props.options

    await t
        .expect(newPropertyDependedOnSelectBoxValue).eql('even')

    await t
        .expect(newDependingPropertySelectBoxOptions).eql([
            {label: 'label_2', value: 2},
            {label: 'label_4', value: 4},
            {label: 'label_6', value: 6},
            {label: 'label_8', value: 8},
            {label: 'label_10', value: 10}
        ])
})
