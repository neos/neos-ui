export interface ILink {
    href: string
    options?: ILinkOptions
}

export interface ILinkOptions {
    anchor?: string
    title?: string
    targetBlank?: boolean
    relNofollow?: boolean
    download?: boolean
}

export function createHrefWithAnchorForLink(link: ILink): string {
    if (link.options?.anchor) {
        return `${link.href}#${link.options?.anchor}`;
    } else {
        return link.href || "#";
    }
}

export function parseBaseHrefAndAnchorFromValue(value: string): { href: string, anchor?: string } {
    if (value.startsWith('#')) {
        return { href: '', anchor: value.substring(1) || undefined };
    }
    const [href, anchor] = value.split('#', 2);
    return { href, anchor: anchor || undefined };
}
