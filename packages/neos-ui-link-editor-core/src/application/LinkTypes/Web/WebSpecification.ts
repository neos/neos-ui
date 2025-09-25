export const isSuitableFor = (link: { href: string }) => {
    if (link.href.startsWith('http://') || link.href.startsWith('https://')) {
        return true;
    }

    if (link.href === '') {
        return true;
    }

    return !link.href.startsWith('node://') && !link.href.startsWith('asset://') && !link.href.startsWith('mailto:') && !link.href.startsWith('tel:');
};
