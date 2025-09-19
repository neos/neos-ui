import {SynchronousRegistry} from '@neos-project/neos-ui-extensibility';

import {Web} from './Web';
import {Node} from './Node';
import {Asset} from './Asset';
import {MailTo} from './MailTo';
import { PhoneNumber } from './PhoneNumber';
import { CustomLink } from './CustomLink';
import {GlobalRegistry} from "@neos-project/neos-ts-interfaces";

export function registerLinkTypes(globalRegistry: GlobalRegistry): void {
    const linkTypeRegistry = new SynchronousRegistry(`
        # LinkEditor LinkType Registry
    `);

    linkTypeRegistry.set(Node.id, Node);
    linkTypeRegistry.set(Asset.id, Asset);
    linkTypeRegistry.set(Web.id, Web);
    linkTypeRegistry.set(MailTo.id, MailTo);
    linkTypeRegistry.set(PhoneNumber.id, PhoneNumber);
    linkTypeRegistry.set(CustomLink.id, CustomLink);

    globalRegistry.set('@neos-project/neos-ui-link-editor/link-types', linkTypeRegistry);
}
