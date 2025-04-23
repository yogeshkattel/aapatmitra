import authService from '$lib/api/authApi';
import { writable } from 'svelte/store';

// Types
export interface User {
	id: string;
	email: string;
	fullName: string;
	isVerified: boolean;
	hasProfile: boolean;
	type: string;
}

// Initial state
interface AuthState {
	user: User | null;
	token: string | null;
	loading: boolean;
	error: string | null;
}

const initialState: AuthState = {
	user: null,
	token: typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null,
	loading: false,
	error: null
};

// Create the store
const createAuthStore = () => {
	const { subscribe, set, update } = writable<AuthState>(initialState);

	return {
		subscribe,

		// Login a user
		login: async (credentials) => {
			update((state) => ({ ...state, loading: true, error: null }));
			try {
				const response = await authService.login(credentials);
				update((state) => ({
					...state,
					user: response.user,
					token: response.access_token,
					loading: false
				}));
				return response;
			} catch (error) {
				const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
				update((state) => ({ ...state, loading: false, error: errorMessage }));
				throw error;
			}
		},

		// Register a new user
		register: async (userData) => {
			update((state) => ({ ...state, loading: true, error: null }));
			try {
				const response = await authService.register(userData);
				update((state) => ({
					...state,
					loading: false
				}));
				return response;
			} catch (error) {
				const errorMessage =
					error.response?.data?.message || 'Registration failed. Please try again.';
				update((state) => ({ ...state, loading: false, error: errorMessage }));
				throw error;
			}
		},

		// Verify account with OTP
		verifyAccount: async (verifyData) => {
			update((state) => ({ ...state, loading: true, error: null }));
			try {
				const response = await authService.verifyAccount(verifyData);
				update((state) => {
					// If we have a user, update the isVerified flag
					if (state.user && state.user.email === verifyData.email) {
						return {
							...state,
							user: { ...state.user, isVerified: true },
							loading: false
						};
					}
					return { ...state, loading: false };
				});
				return response;
			} catch (error) {
				const errorMessage =
					error.response?.data?.message || 'Verification failed. Please try again.';
				update((state) => ({ ...state, loading: false, error: errorMessage }));
				throw error;
			}
		},

		// Logout a user
		logout: () => {
			authService.logout();
			set(initialState);
		},

		// Load user data (call on app init)
		loadUser: async () => {
			const token = localStorage.getItem('token');
			if (!token) return;

			update((state) => ({ ...state, loading: true, error: null }));
			try {
				// Get user profile to check if they have one
				const profileResponse = await authService.getProfile();
				const hasProfile = !!profileResponse;

				// You would typically have an endpoint to get the current user data
				// For now, we'll fake it with the profile data
				update((state) => ({
					...state,
					user: {
						...profileResponse.user,
						hasProfile,
						isVerified: true // Assuming if they have a profile, they're verified
					},
					loading: false
				}));
			} catch (error) {
				// 401 means token is invalid/expired
				if (error.response?.status === 401) {
					authService.logout();
					set(initialState);
				} else {
					update((state) => ({
						...state,
						loading: false,
						error: 'Failed to load user data'
					}));
				}
			}
		},

		// Create user profile
		createProfile: async (profileData) => {
			update((state) => ({ ...state, loading: true, error: null }));
			try {
				const response = await authService.createProfile(profileData);
				update((state) => {
					if (state.user) {
						return {
							...state,
							user: { ...state.user, hasProfile: true },
							loading: false
						};
					}
					return { ...state, loading: false };
				});
				return response;
			} catch (error) {
				const errorMessage =
					error.response?.data?.message || 'Failed to create profile. Please try again.';
				update((state) => ({ ...state, loading: false, error: errorMessage }));
				throw error;
			}
		},

		// Clear any errors
		clearError: () => {
			update((state) => ({ ...state, error: null }));
		},

		// Resend verification OTP
		resendVerificationOtp: async (email: string) => {
			update((state) => ({ ...state, loading: true, error: null }));
			try {
				await authService.resendVerificationOtp(email);
				update((state) => ({
					...state,
					loading: false,
					error: null
				}));
				return { success: true };
			} catch (error) {
				const errorMessage = error.response?.data?.message || 'Failed to resend verification code';
				update((state) => ({
					...state,
					loading: false,
					error: errorMessage
				}));
				return { success: false, error: errorMessage };
			}
		}
	};
};

// Export the store
export const authStore = createAuthStore();
