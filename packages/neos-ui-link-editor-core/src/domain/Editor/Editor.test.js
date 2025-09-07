import {Subscription} from 'rxjs';
import {createEditor} from './Editor';
import {describe, beforeEach, afterEach, it} from "node:test";
import {equal, deepEqual} from "node:assert/strict";

describe('Editor', () => {
    const {state$, tx: {editLink, dismiss, unset, apply}} = createEditor();
    /** @type IEditorState */
    let state;
    /** @type Subscription */
    let subscription;

    beforeEach(() => {
        subscription = state$.subscribe(latest => {
            state = latest;
        });
    });

    afterEach(() => {
        subscription.unsubscribe();
    });

    it('applies links', (_t, done) => {
        editLink({href: 'http://example.com/'}).then(result => {
            equal(state.isOpen, false);
            equal(result.change, true);
            deepEqual(result.value, {href: 'https://changed.com/'});

            setImmediate(done);
        });
        setImmediate(() => {
            equal(state.isOpen, true);
            deepEqual(state.initialValue, {href: 'http://example.com/'});

            apply({href: 'https://changed.com/'});
        })
    });

    it('unsets links', (_t, done) => {
        editLink({href: 'http://example.com/'}).then(result => {
            equal(state.isOpen, false);
            equal(result.change, true);
            equal(result.value, null);
            setImmediate(done);
        });

        setImmediate(() => {
            equal(state.isOpen, true);
            deepEqual(state.initialValue, {href: 'http://example.com/'});

            unset();
        });
    });

    it('can be dismissed', (_t, done) => {
        editLink({href: 'http://example.com'}).then(result => {
            equal(state.isOpen, false);
            equal(result.change, false);
            setImmediate(done);
        });

        setImmediate(() => {
            equal(state.isOpen, true);
            deepEqual(state.initialValue, {href: 'http://example.com'});

            dismiss();
        });
    });
});


