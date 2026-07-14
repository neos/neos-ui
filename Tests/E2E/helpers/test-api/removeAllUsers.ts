
export async function removeAllUsers(prefix: string): Promise<void> {
    const response = await fetch('http://onedimension.localhost:8081/test/remove-all-users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({prefix})
    });
    const json = await response.json();
    if (!('success' in json) || !json.success) {
        throw new Error('User could not be removed.');
    }
}
