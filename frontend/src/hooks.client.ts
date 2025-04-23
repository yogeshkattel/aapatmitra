import { browser } from '$app/environment';
import type { HandleClientError } from '@sveltejs/kit';

// This runs after the server sends a response
export const handleError: HandleClientError = async ({ error, event }) => {
	return {
		message: 'An unexpected error occurred',
		code: (error as any)?.code ?? 'UNKNOWN'
	};
};

// This runs after every navigation
if (browser) {
	// Check if the page just loaded from a server request with the clear auth header
	const clearAuthHeader = document.querySelector('meta[name="clear-auth"]');

	if (clearAuthHeader && clearAuthHeader.getAttribute('content') === 'true') {
		console.log('Clearing auth data from localStorage');
		localStorage.removeItem('token');
		localStorage.removeItem('auth');
		localStorage.removeItem('session');
		localStorage.removeItem('user');
	}
}
