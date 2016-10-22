import test from 'ava';

import getCsrfToken, {ERROR_UNABLE_RETRIEVE_CSRF} from './getCsrfToken';

test(`should be exposed as a function.`, t => {
    t.is(typeof (getCsrfToken), 'function');
});

test(`should call and return value of the 'csrfToken' within the given 'neos' context.`, t => {
    const token = 'foo';
    const neos = {csrfToken: () => token};
    const context = {neos};

    t.is(getCsrfToken(context), 'foo');
});

test(`should throw an error in case the CSRF token cannot be returned.`, t => {
    t.throws(getCsrfToken, ERROR_UNABLE_RETRIEVE_CSRF);
});
