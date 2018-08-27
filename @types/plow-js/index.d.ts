declare module 'plow-js' {
    export function $get<K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2], T>(path: [K1, K2, K3], subject: T): T[K1][K2][K3];
    export function $get<K1 extends keyof T, K2 extends keyof T[K1], T>(path: [K1, K2], subject: T): T[K1][K2];
    export function $get<K1 extends keyof T, T>(path: [K1], subject: T): T[K1];

    export function $set<K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2], V extends T[K1][K2][K3], T extends object>(path: [K1, K2, K3], value: V, subject: T): T
    export function $set<K1 extends keyof T, K2 extends keyof T[K1], V extends T[K1][K2], T>(path: [K1, K2], value: V, subject: T): T
    export function $set<K1 extends keyof T, V extends T[K1], T extends object>(path: [K1], value: V, subject: T): T

    // TODO: type this properly
    export function $toggle<S>(path: string | [], subject: S): S;
    export function $toggle<S>(path: string | []): (subject: S) => S;
}
