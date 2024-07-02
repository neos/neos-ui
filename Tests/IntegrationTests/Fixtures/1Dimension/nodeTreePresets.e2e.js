import {beforeEach, checkPropTypes} from './../../utils.js';
import {Page} from './../../pageModel';
import {Selector} from 'testcafe';

/* global fixture:true */

fixture`Node Tree Presets`
    .beforeEach(beforeEach)
    .afterEach(() => checkPropTypes())
    .before(async () => {
        const response = await fetch('http://127.0.0.1:8081/test/write-additional-settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({settings: SETTINGS_WITH_NODE_TREE_PRESETS})
        });
        const json = await response.json();
        if (!('success' in json) || !json.success) {
            throw new Error('Additional settings could not be written.');
        }
    })
    .after(async () => {
        const response = await fetch('http://127.0.0.1:8081/test/remove-additional-settings', {
            method: 'POST'
        });
        const json = await response.json();
        if (!('success' in json) || !json.success) {
            throw new Error('Additional settings could not be removed.');
        }
    });

const SETTINGS_WITH_NODE_TREE_PRESETS = {
    Neos: {
        Neos: {
            userInterface: {
                navigateComponent: {
                    nodeTree: {
                        loadingDepth: 2,
                        presets: {
                            'default': {
                                baseNodeType: 'Neos.Neos:Document,!Neos.TestNodeTypes:Document.Blog,!Neos.TestNodeTypes:Document.BlogArticle'
                            },
                            'blog': {
                                ui: {
                                    icon: 'newspaper-o',
                                    label: 'Show Blog only'
                                },
                                baseNodeType: 'Neos.TestNodeTypes:Document.Blog'
                            },
                            'blog-articles': {
                                ui: {
                                    icon: 'file-text-o',
                                    label: 'Show Blog Articles only'
                                },
                                baseNodeType: 'Neos.TestNodeTypes:Document.BlogArticle'
                            }
                        }
                    }
                }
            }
        }
    }
};

test('Node tree preset "default" removes all blog related nodes and only loads nodes with depth <= 2', async (t) => {
    //
    // Assert that all documents with a depth > 2 are no longer visible in
    // "default" preset
    //
    await t.expect(Page.treeNode.withExactText('Nested Page #2').exists)
        .notOk('[🗋 Nested Page #2] can still be found in the document tree with preset "default".');

    //
    // Assert that all the blog-related documents are not visible in "default"
    // preset
    //
    await t.expect(Page.treeNode.withExactText('Blog').exists)
        .notOk('[🗋 Blog] can still be found in the document tree with preset "default".');
    await t.expect(Page.treeNode.withExactText('Hello World!').exists)
        .notOk('[🗋 Hello World!] can still be found in the document tree with preset "default".');
    await t.expect(Page.treeNode.withExactText('Fix all the bugs with this weird little trick!').exists)
        .notOk('[🗋 Fix all the bugs with this weird little trick!] can still be found in the document tree with preset "default".');
    await t.expect(Page.treeNode.withExactText('Writing Blog Articles considered harmful').exists)
        .notOk('[🗋 Writing Blog Articles considered harmful] can still be found in the document tree with preset "default".');
});

test('Node tree preset "blog" shows nothing but page [🗋 Blog]', async (t) => {
    await t.click('#btn-ToggleDocumentTreeFilter');
    await t.click('#neos-NodeTreeFilter');
    await t.click(Selector('[role="button"]').withText('Show Blog only'));

    await t.expect(Page.treeNode.withExactText('Blog').exists)
        .ok('[🗋 Blog] did not show up after switching to node tree preset "blog".');
});

test('Node tree preset "blog-articles" shows page [🗋 Blog] and all articles beneath it', async (t) => {
    await t.click('#btn-ToggleDocumentTreeFilter');
    await t.click('#neos-NodeTreeFilter');
    await t.click(Selector('[role="button"]').withText('Show Blog Articles only'));

    await t.expect(Page.treeNode.withExactText('Blog').exists)
        .ok('[🗋 Blog] did not show up after switching to node tree preset "blog-articles".');
    await t.expect(Page.treeNode.withExactText('Hello World!').exists)
        .ok('[🗋 Hello World!] did not show up after switching to node tree preset "blog-articles".');
    await t.expect(Page.treeNode.withExactText('Fix all the bugs with this weird little trick!').exists)
        .ok('[🗋 Fix all the bugs with this weird little trick!] did not show up after switching to node tree preset "blog-articles".');
    await t.expect(Page.treeNode.withExactText('Writing Blog Articles considered harmful').exists)
        .ok('[🗋 Writing Blog Articles considered harmful] did not show up after switching to node tree preset "blog-articles".');
});

//
// Original issue: https://github.com/neos/neos-ui/issues/3816
