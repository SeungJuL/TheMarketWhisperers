export const login = async (credentials) => {
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include', // Ensure cookies are sent with the request
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
};

export const logout = async () => {
    await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include', // Ensure cookies are sent with the request
    });
};

export const checkSession = async () => {
    const response = await fetch('/api/session', {
        method: 'GET',
        credentials: 'include', // Ensure cookies are sent with the request
    });
    if (!response.ok) return null;
    return response.json();
};