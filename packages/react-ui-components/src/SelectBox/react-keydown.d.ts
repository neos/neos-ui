interface KeyMap {
    readonly [key: string]: number;
}

declare const keydown: (args: number | ReadonlyArray<number>) => any

declare module 'react-keydown' {
    export const Keys: KeyMap
    export default keydown
}
