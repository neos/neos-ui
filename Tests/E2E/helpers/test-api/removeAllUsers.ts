
export async function removeAllUsers(): Promise<void> {
    const response = await fetch('http://127.0.0.1:8081/test/remove-all-users', {
        method: 'POST'
    });
    const json = await response.json();
    if (!('success' in json) || !json.success) {
        throw new Error('User could not be removed.');
    }
}
