import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, cookies,  }) => {
	// For direct access to the page, we'll clear any server-side session
	if (cookies.get('session')) {
		cookies.delete('session', { path: '/' });
	}

	// Set clearAuth flag to trigger client-side cleanup
	locals.clearAuth = true;

	// Let the client handle cleanup and form submission
	return {
		status: 'logging_out'
	};
};

export const actions: Actions = {
	default: async ({ cookies, locals }) => {
		// Clear any server-side session information
		if (cookies.get('session')) {
			cookies.delete('session', { path: '/' });
		}

		// Set clearAuth flag to trigger client-side cleanup
		locals.clearAuth = true;

		// Redirect after POST submission
		throw redirect(302, '/logout');
	}
};
