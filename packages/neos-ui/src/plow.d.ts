// Temporary Plow typings
// TODO: move to Plow
declare module 'plow-js' {
    export function $get<K1 extends keyof S, S>(path: [K1], state: S): S[K1];
    export function $get<K1 extends keyof S, K2 extends keyof S[K1], S>(path: [K1, K2], state: S): S[K1][K2];
    export function $get<K1 extends keyof S, K2 extends keyof S[K1], K3 extends keyof S[K1][K2], S>(path: [K1, K2, K3], state: S): S[K1][K2][K3];

    export function $set<K1 extends keyof S, V extends S[K1], S>(path: [K1], value: V, state: S): S;
    export function $set<K1 extends keyof S, K2 extends keyof S[K1], V extends S[K1][K2], S>(path: [K1, K2], value: V, state: S): S;
    export function $set<K1 extends keyof S, K2 extends keyof S[K1], K3 extends keyof S[K1][K2], V extends S[K1][K2][K3], S>(path: [K1, K2, K3], value: V, state: S): S;
}
