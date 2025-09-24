export const isSuitableFor = (link: { href: string }) => {
    if (link.href.startsWith('http://') || link.href.startsWith('https://')) {
        return true;
    }

    if (link.href === '') {
        return true;
    }

    if (link.href.startsWith('javascript:')) {
        return false;
    }

    if (link.href.includes(' ')) {
        return false;
    }

    return !link.href.startsWith('node://') && !link.href.startsWith('asset://') && !link.href.startsWith('mailto:') && !link.href.startsWith('tel:');
};
