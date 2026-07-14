
export async function createUser(name: string, password: string, roles: string[]): Promise<void> {
    const response = await fetch('http://onedimension.localhost:8081/test/create-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({name, password, roles})
    });
    const json = await response.json();
    if (!('success' in json) || !json.success) {
        throw new Error('User could not be created.');
    }
}
