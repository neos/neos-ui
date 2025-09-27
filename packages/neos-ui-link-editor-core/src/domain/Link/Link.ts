export interface ILink {
    href: string
    options?: ILinkOptions
}

export interface ILinkOptions {
    title?: string
    targetBlank?: boolean
    relNofollow?: boolean
    download?: boolean
}
