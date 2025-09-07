import {describe, it} from 'node:test';
import {equal} from 'node:assert/strict';

import {isSuitableFor} from './NodeSpecification';

describe('LinkType: Node', () => {
    it('is not satisfied by http:// links', () => {
        const link = {
            href: 'http://www.example.com'
        };

        equal(isSuitableFor(link), false);
    });

    it('is not satisfied by https:// links', () => {
        const link = {
            href: 'https://www.example.com'
        };

        equal(isSuitableFor(link), false);
    });

    it('is satisfied by node:// links', () => {
        const link = {
            href: 'node://97c9a6e3-4b50-4559-9f60-b5ad68f25758'
        };

        equal(isSuitableFor(link), true);
    });

    it('is satisfied by node:// links with a hash', () => {
        const link = {
            href: 'node://97c9a6e3-4b50-4559-9f60-b5ad68f25758#section'
        };

        equal(isSuitableFor(link), true);
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

    it('is not satisfied by invalid links', () => {
        const link = {
            href: 'Think of Beethoven\'s 5th: foo foo foo bar'
        };

        equal(isSuitableFor(link), false);
    });

    it('is not satisfied by tel: links', () => {
        const link = {
            href: 'tel:+491258795857'
        };

        equal(isSuitableFor(link), false);
    });
});
