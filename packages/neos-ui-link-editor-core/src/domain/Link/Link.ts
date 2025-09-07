export interface ILink {
    href: string
    options?: ILinkOptions
}

export interface ILinkOptions {
    anchor?: string
    title?: string
    targetBlank?: boolean
    relNofollow?: boolean
}