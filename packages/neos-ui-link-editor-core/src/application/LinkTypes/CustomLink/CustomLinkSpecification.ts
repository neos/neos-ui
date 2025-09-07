import {ILink} from "../../../domain";

export const isSuitableFor = (link: ILink) => {
    if (link.href.startsWith('asset://') && link.href.includes('#')) {
        // hack to allow to append assets an anchor
        return true;
    }
    return !link.href.startsWith('node://') && !link.href.startsWith('asset://') && !link.href.startsWith('mailto:')
        && !link.href.startsWith('tel:') && !link.href.startsWith('http://') && !link.href.startsWith('https://');
}
