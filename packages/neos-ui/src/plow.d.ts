// Temporary Plow typings
// TODO: move to Plow
// TODO: rename 'state' to 'obj' as it's not for state objects exclusively
declare module 'plow-js' {
    export function $get<K1 extends keyof S, S>(path: [K1], state: S): S[K1];
    export function $get<K1 extends keyof S, K2 extends keyof S[K1], S>(path: [K1, K2], state: S): S[K1][K2];
    export function $get<K1 extends keyof S, K2 extends keyof S[K1], K3 extends keyof S[K1][K2], S>(path: [K1, K2, K3], state: S): S[K1][K2][K3];
    export function $get<K1 extends keyof S, K2 extends keyof S[K1], K3 extends keyof S[K1][K2], K4 extends keyof S[K1][K2][K3], S>(path: [K1, K2, K3, K4], state: S): S[K1][K2][K3][K4];
    export function $get<K1 extends keyof S, K2 extends keyof S[K1], K3 extends keyof S[K1][K2], K4 extends keyof S[K1][K2][K3], K5 extends keyof S[K1][K2][K3][K4], S>(path: [K1, K2, K3, K4, K5], state: S): S[K1][K2][K3][K4][K5];

    export function $set<K1 extends keyof S, V extends S[K1], S>(path: [K1], value: V, state: S): S;
    export function $set<K1 extends keyof S, K2 extends keyof S[K1], V extends S[K1][K2], S>(path: [K1, K2], value: V, state: S): S;
    export function $set<K1 extends keyof S, K2 extends keyof S[K1], K3 extends keyof S[K1][K2], V extends S[K1][K2][K3], S>(path: [K1, K2, K3], value: V, state: S): S;
}
