import Immutable from 'immutable';
import {$all, $set, $get} from 'plow-js';

import * as selectors from './selectors.js';

test(`should export selectors`, () => {
    expect(selectors).not.toBe(undefined);
    expect(typeof (selectors.imageLookup)).toBe('function');
});

test(`imageByUuid selector should return function that returns image data for a given uuid in the given state`, () => {
    const state = Immutable.fromJS($all(
        $set('cr.images.byUuid.5e798eb0-dc1c-40d6-b1f7-f6c046a7a8d7', {
            status: 'LOADED',
            some: 'value'
        }),
        {}
    ));
    const byExistentUuid = selectors.imageByUuid('5e798eb0-dc1c-40d6-b1f7-f6c046a7a8d7');
    const byNonExistentUuid = selectors.imageByUuid('355a1ee1-638a-4453-9cb5-e5735aa19493');

    expect(byExistentUuid(state)).toMatchSnapshot();
    expect(byNonExistentUuid(state)).toBe(undefined);
});

test(`imageLookup selector should return function that returns image data for the given state and uuid`, () => {
    const state = Immutable.fromJS($all(
        $set('cr.images.byUuid.5e798eb0-dc1c-40d6-b1f7-f6c046a7a8d7', {
            status: 'LOADED',
            some: 'value'
        }),
        {}
    ));
    const byUuid = selectors.imageLookup(state);

    expect(byUuid('5e798eb0-dc1c-40d6-b1f7-f6c046a7a8d7')).toMatchSnapshot();
    expect(byUuid('355a1ee1-638a-4453-9cb5-e5735aa19493')).toBe(undefined);
});
