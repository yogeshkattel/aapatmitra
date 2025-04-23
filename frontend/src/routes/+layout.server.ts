import { jwtDecode } from 'jwt-decode';
import type { LayoutServerLoad } from './$types';

interface JwtPayload {
	sub: string;
	iat: number;
	roles: string[];
	exp: number;
}

export const load: LayoutServerLoad = async ({ cookies, fetch }) => {
	const session = cookies.get('session');

	// Return empty data if no session
	if (!session) {
		return {
			session: null,
			user: null
		};
	}

	try {
		// Decode the JWT to get the user ID (sub)
		const decoded = jwtDecode<JwtPayload>(session);

		// Check if token is expired
		const now = Math.floor(Date.now() / 1000);
		if (decoded.exp < now) {
			// Clear the expired session
			cookies.delete('session', { path: '/' });
			return {
				session: null,
				user: null
			};
		}

		// Try to fetch user data using the token
		try {
			const response = await fetch('http://127.0.0.1:8000/profile', {
				headers: {
					Authorization: `Bearer ${session}`
				}
			});

			if (response.ok) {
				const userData = await response.json();
				return {
					session,
					user: userData.data
				};
			}
		} catch (error) {
			console.error('Failed to fetch user data', error);
		}

		// Return just the session if user data fetch fails
		return {
			session,
			user: {
				userId: decoded.sub,
				roles: decoded.roles || []
			}
		};
	} catch (error) {
		// If token is invalid, clear it
		cookies.delete('session', { path: '/' });
		return {
			session: null,
			user: null
		};
	}
};
