
export function createUniqueUserName(suffix: string): string {
    return `${getUniqueUserNamePrefix()}${suffix}`;
}

export function getUniqueUserNamePrefix(): string {
    return `test-${process.env.TEST_WORKER_INDEX}-`;
}
