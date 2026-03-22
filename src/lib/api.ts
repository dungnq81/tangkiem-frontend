const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiOptions extends RequestInit {
	next?: {
		revalidate?: number | false;
		tags?: string[];
	};
}

export async function apiClient<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
	const res = await fetch(`${API_URL}${endpoint}`, {
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		...options,
	});

	if (!res.ok) {
		throw new Error(`API Error: ${res.status} - ${res.statusText}`);
	}

	return res.json();
}

// Helpers for common patterns
export const api = {
	get: <T>(endpoint: string, revalidate?: number) =>
		apiClient<T>(endpoint, {
			next: revalidate !== undefined ? { revalidate } : undefined,
		}),

	post: <T>(endpoint: string, body: unknown) =>
		apiClient<T>(endpoint, {
			method: 'POST',
			body: JSON.stringify(body),
		}),

	put: <T>(endpoint: string, body: unknown) =>
		apiClient<T>(endpoint, {
			method: 'PUT',
			body: JSON.stringify(body),
		}),

	delete: <T>(endpoint: string) =>
		apiClient<T>(endpoint, {
			method: 'DELETE',
		}),
};
