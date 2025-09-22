import {ILink} from "@neos-project/neos-ui-link-editor-core/src/domain";

/**
 * Translates to php's {@see \Neos\Neos\Ui\LinkEditor\Link}
 */
export type LinkValueObject = {
    href: string;
    title?: string;
    target?: string;
    rel: string[];
    download: boolean;
};

export enum LinkDataType {
    string,
    valueObject
}

/**
 * These are the possible formats from {@see LinkDataType} to store the link in the Node.
 *  The string is the default
 *  The valueObject is on php side this vo: {@see \Neos\Neos\Ui\LinkEditor\Link}
 */
export type SerializeableLink = {
    dataType: LinkDataType.valueObject,
    value: LinkValueObject | null
} | {
    dataType: LinkDataType.string,
    value: string | null
}

/**
 * Determine based on the property type of the schema how to interpret the property value
 */
export const resolveSerializedLinkFromValue = (value: any, linkDataType: LinkDataType): SerializeableLink => {
    if (linkDataType === LinkDataType.valueObject) {
        // @ts-ignore
        const linkArray = (typeof value === "object" && value !== null && "href" in value && typeof value.href === "string") ? value as LinkValueObject : null;
        return {
            dataType: linkDataType,
            value: linkArray
        }
    }
    return {
        dataType: linkDataType,
        value: typeof value === "string" ? (value || null) : null
    }
}

/**
 * Convert the {@see SerializeableLink} to the editor representation.
 * For example the anchor field is in the value object encoded into the href, but for editing treated separately.
 *
 * Counterpart of {@see convertILinkToSerializedLinkValue}
 */
export const serializedLinkToILink = (serializedLink: SerializeableLink): ILink | null => {
    if (!serializedLink.value) {
        return null;
    }
    switch (serializedLink.dataType) {
        case LinkDataType.valueObject:
            const linkValueObject = serializedLink.value;

            const [baseHref, hash] = linkValueObject.href.split('#', 2);

            return {
                href: baseHref,
                options: {
                    anchor: hash || undefined,
                    title: linkValueObject.title || undefined,
                    targetBlank: linkValueObject.target ? linkValueObject.target === '_blank' : undefined,
                    relNofollow: linkValueObject.rel.includes('nofollow'),
                    download: Boolean(linkValueObject.download),
                }
            };
        case LinkDataType.string:
            const [baseHref2, hash2] = serializedLink.value.split('#', 2);

            return {
                href: baseHref2,
                options: {
                    anchor: hash2 || undefined,
                }
            };
    }
}

/**
 * Convert the editor representation of the link to the {@see SerializeableLink.value}
 * For example the anchor field is for editing treated separately but in the value object encoded into the href.
 *
 * Counterpart of {@see serializedLinkToILink}
 */
export const convertILinkToSerializedLinkValue = (link: ILink, dataType: LinkDataType): any => {
    const href = link.options?.anchor
        ? `${link.href}#${link.options.anchor}`
        : link.href;

    switch (dataType) {
        case LinkDataType.valueObject:
            return {
                href: href,
                title: link.options?.title,
                target: link.options?.targetBlank ? '_blank' : undefined,
                rel: link.options?.relNofollow ? ['nofollow'] : [],
                download: link.options?.download
            };
        case LinkDataType.string:
            return href;
    }
}
