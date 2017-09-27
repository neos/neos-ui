import Immutable from 'immutable';
import {$all, $set} from 'plow-js';

import {getUncollapsed} from './selectors';

test('getUncollapsed should return the context paths of manually toggled nodes', () => {
    const state = Immutable.fromJS($all(
        $set('cr.nodes.siteNode', '/sites/site@some-user'),
        $set('cr.nodes.byContextPath', {
            '/sites/site@some-user': {contextPath: '/sites/site@some-user', depth: 1},
            '/sites/site/context-path-1@some-user': {contextPath: '/sites/site/context-path-1@some-user', depth: 2},
            '/sites/site/context-path-2@some-user': {contextPath: '/sites/site/context-path-2@some-user', depth: 2},
            '/sites/site/context-path-3@some-user': {contextPath: '/sites/site/context-path-3@some-user', depth: 2}
        }),
        $set('ui.pageTree.toggled', [
            '/sites/site/context-path-1@some-user',
            '/sites/site/context-path-2@some-user'
        ]),
        {}
    ));

    const result = getUncollapsed(state, {loadingDepth: 1});

    expect(result.includes('/sites/site/context-path-1@some-user')).toBe(true);
    expect(result.includes('/sites/site/context-path-2@some-user')).toBe(true);
    expect(result.includes('/sites/site/context-path-3@some-user')).toBe(false);
});

test('getUncollapsed should return the context paths of nodes within the loading depth that have not been toggled', () => {
    const state = Immutable.fromJS($all(
        $set('cr.nodes.siteNode', '/sites/site@some-user'),
        $set('cr.nodes.byContextPath', {
            '/sites/site@some-user': {contextPath: '/sites/site@some-user', depth: 1},
            '/sites/site/context-path-1@some-user': {contextPath: '/sites/site/context-path-1@some-user', depth: 2},
            '/sites/site/context-path-2@some-user': {contextPath: '/sites/site/context-path-2@some-user', depth: 2},
            '/sites/site/context-path-3@some-user': {contextPath: '/sites/site/context-path-3@some-user', depth: 2},
            '/sites/site/deeper/context-path-1@some-user': {contextPath: '/sites/site/deeper/context-path-1@some-user', depth: 3},
            '/sites/site/deeper/context-path-2@some-user': {contextPath: '/sites/site/deeper/context-path-2@some-user', depth: 3}
        }),
        $set('ui.pageTree.toggled', [
            // should be collapsed
            '/sites/site/context-path-1@some-user',
            '/sites/site/context-path-2@some-user',

            // should be uncollapsed
            '/sites/site/deeper/context-path-2@some-user'
        ]),
        {}
    ));

    const result = getUncollapsed(state, {loadingDepth: 2});

    expect(result.includes('/sites/site/context-path-1@some-user')).toBe(false);
    expect(result.includes('/sites/site/context-path-2@some-user')).toBe(false);

    expect(result.includes('/sites/site/context-path-3@some-user')).toBe(true);
    expect(result.includes('/sites/site/deeper/context-path-2@some-user')).toBe(true);
});
