import {describe, it} from 'node:test';
import {equal} from 'node:assert/strict';

import {isSuitableFor} from './WebSpecification';

describe('LinkType: Web', () => {
    it('is satisfied by http:// links', () => {
        const link = {
            href: 'http://www.example.com'
        };

        equal(isSuitableFor(link), true);
    });

    it('is satisfied by https:// links', () => {
        const link = {
            href: 'https://www.example.com'
        };

        equal(isSuitableFor(link), true);
    });

    it('is satisfied by relative link', () => {
        const link = {
            href: 'foo/bar'
        };

        equal(isSuitableFor(link), true);
    });

    it('is satisfied by host relative link', () => {
        const link = {
            href: '/foo/bar'
        };

        equal(isSuitableFor(link), true);
    });

    it('is satisfied by empty relative link', () => {
        const link = {
            href: ''
        };

        equal(isSuitableFor(link), true);
    });

    it('is sadly also satisfied by javascript: links', () => {
        const link = {
            href: 'javascript:'
        };

        equal(isSuitableFor(link), true);
    });

    it('is not satisfied by node:// links', () => {
        const link = {
            href: 'node://97c9a6e3-4b50-4559-9f60-b5ad68f25758'
        };

        equal(isSuitableFor(link), false);
    });

    it('is not satisfied by asset:// links', () => {
        const link = {
            href: 'asset://97c9a6e3-4b50-4559-9f60-b5ad68f25758'
        };

        equal(isSuitableFor(link), false);
    });

    it('is not satisfied by mailto: links', () => {
        const link = {
            href: 'mailto:foo@example.com'
        };

        equal(isSuitableFor(link), false);
    });

    it('is also satisfied by seemingly invalid links (with the correct encoding it works)', () => {
        const link = {
            href: 'Think of Beethoven\'s 5th: foo foo foo bar'
        };

        equal(isSuitableFor(link), true);
    });

    it('is not satisfied by tel: links', () => {
        const link = {
            href: 'tel:+491258795857'
        };

        equal(isSuitableFor(link), false);
    });
});
