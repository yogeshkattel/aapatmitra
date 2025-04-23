// src/lib/api/authApi.js
import { goto } from '$app/navigation';
import { auth } from '$lib/stores/auth.store';

const API_BASE_URL = 'http://127.0.0.1:8000';

// Define types for API options
interface ApiOptions {
	method?: string;
	headers?: Record<string, string>;
	body?: string;
}

// Helper function for making API requests
export const fetchWithAuth = async (endpoint: string, options: ApiOptions = {}) => {
	let authToken = null;

	// Get token from auth store if available
	auth.subscribe((value) => {
		authToken = value.token;
	})();

	// Set default headers
	const headers = {
		'Content-Type': 'application/json',
		...options.headers
	};

	// Add auth header if token exists
	if (authToken) {
		headers['Authorization'] = `Bearer ${authToken}`;
	}

	// Make the request
	const response = await fetch(`${API_BASE_URL}${endpoint}`, {
		...options,
		headers
	});

	// Handle error responses
	if (!response.ok) {
		const error = await response.json().catch(() => ({
			message: 'An unknown error occurred'
		}));
		throw new Error(error.message || 'Request failed');
	}

	return response.json();
};

// Auth API methods
export const authApi = {
	// Register a new user
	register: async (userData) => {
		const response = await fetch(`${API_BASE_URL}/auth/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(userData)
		});

		if (!response.ok) {
			throw new Error('Registration failed');
		}

		const data = await response.json();
		return data;
	},

	// Login user
	login: async (credentials) => {
		try {
			const response = await fetch(`${API_BASE_URL}/auth/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(credentials)
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Login failed');
			}

			const data = await response.json();
			console.log('Login response:', data);

			// Set the session cookie for server-side auth
			if (data.data?.accessToken) {
				// Set the session cookie with the JWT
				document.cookie = `session=${data.data.accessToken}; path=/; max-age=3600; SameSite=Strict`;

				// Update auth store with user data and token
				auth.login(data.data.existingUser, data.data.accessToken);

				// Force redirect to dashboard
				window.location.href = '/dashboard';
				return data;
			} else {
				console.error('No access token in response:', data);
				throw new Error('Invalid response from server');
			}
		} catch (error) {
			console.error('Login error:', error);
			throw error;
		}
	},

	// Verify user email with OTP
	verifyEmail: async (verificationData) => {
		return fetchWithAuth('/auth/verify', {
			method: 'POST',
			body: JSON.stringify(verificationData)
		});
	},

	// Request password reset
	forgotPassword: async (email) => {
		return fetchWithAuth('/auth/forgot-password', {
			method: 'POST',
			body: JSON.stringify({ email })
		});
	},

	// Reset password with OTP
	resetPassword: async (resetData) => {
		return fetchWithAuth('/auth/reset-password', {
			method: 'POST',
			body: JSON.stringify(resetData)
		});
	},

	// Change password (authenticated)
	changePassword: async (passwordData) => {
		return fetchWithAuth('/auth/change-password', {
			method: 'POST',
			body: JSON.stringify(passwordData)
		});
	},

	// Request new verification OTP
	resendVerificationOtp: async (email) => {
		return fetchWithAuth(`/auth/resendVerificationOtp/${email}`, {
			method: 'GET'
		});
	},

	// Delete account
	deleteAccount: async (data) => {
		return fetchWithAuth('/auth/delete-account', {
			method: 'POST',
			body: JSON.stringify(data)
		});
	},

	// Google login
	googleLogin: () => {
		window.location.href = `${API_BASE_URL}/auth/login/google`;
	},

	// Log out
	logout: async () => {
		// Clear the auth store
		auth.logout();

		// Clear session cookie
		document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

		// Redirect to home page
		window.location.href = '/';
	}
};

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface RegisterData {
	email: string;
	password: string;
	password2: string;
	fullName: string;
	type?: string;
	country?: string;
}

export async function login(credentials: LoginCredentials) {
	try {
		const response = await fetch(`${API_BASE_URL}/auth/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(credentials)
		});

		if (!response.ok) {
			throw new Error('Login failed');
		}

		const data = await response.json();

		// Set the session cookie for server-side auth
		if (data.data?.accessToken) {
			// Set the session cookie with the JWT
			document.cookie = `session=${data.data.accessToken}; path=/; max-age=3600; SameSite=Strict`;

			// Redirect to dashboard
			window.location.href = '/dashboard';
		}

		return data;
	} catch (error) {
		console.error('Login error:', error);
		throw error;
	}
}

export async function register(userData: RegisterData) {
	const response = await fetch(`${API_BASE_URL}/auth/register`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(userData)
	});

	if (!response.ok) {
		throw new Error('Registration failed');
	}

	const data = await response.json();
	return data;
}

export async function logout() {
	// Clear session cookie
	document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

	// Redirect to home page
	window.location.href = '/';
}
