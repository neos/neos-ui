interface KeyMap {
    [key: string]: number;
}

declare module 'react-keydown' {
    const Keys: KeyMap
}
