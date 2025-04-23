import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const handleAuth: Handle = async ({ event, resolve }) => {
	const session = event.cookies.get('session');

	// Add clearAuth to locals if coming from logout page
	if (event.url.pathname === '/logout') {
		event.locals.clearAuth = true;
	}

	if (!session) {
		// No session - redirect to login for protected routes
		if (event.url.pathname.startsWith('/dashboard')) {
			throw redirect(303, '/login');
		}
	} else {
		// User is logged in
		if (event.url.pathname === '/login' || event.url.pathname === '/register') {
			throw redirect(303, '/dashboard');
		}

		// Check if user has a profile
		// Skip the check for profile creation page to avoid redirect loops
		if (!event.url.pathname.includes('/profile/create')) {
			try {
				// Try to fetch profile
				const profileResponse = await fetch('http://127.0.0.1:8000/profile', {
					headers: {
						Authorization: `Bearer ${session}`
					}
				});

				// If profile doesn't exist and user is trying to access dashboard,
				// redirect to profile creation
				if (
					!profileResponse.ok &&
					event.url.pathname.startsWith('/dashboard') &&
					!event.url.pathname.includes('/profile/create')
				) {
					throw redirect(303, '/dashboard/profile/create');
				}
			} catch (error) {
				console.error('Error checking profile:', error);
			}
		}
	}

	// Create response with transformed HTML if needed
	let response;

	if (event.locals.clearAuth) {
		// If we need to clear auth, transform the HTML to include the meta tag
		response = await resolve(event, {
			transformPageChunk: ({ html }) => {
				return html.replace('<head>', '<head><meta name="clear-auth" content="true">');
			}
		});

		// Also set header for API responses
		response.headers.set('X-Clear-Auth', 'true');
	} else {
		// Normal response
		response = await resolve(event);
	}

	return response;
};

export const handle = sequence(handleAuth);
