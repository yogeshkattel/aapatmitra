// src/lib/stores/authStore.js
import { browser } from '$app/environment';
import { derived, writable } from 'svelte/store';

// Initial state - check localStorage for existing token
const storedAuth = browser
	? JSON.parse(localStorage.getItem('auth')) || { user: null, token: null, isAuthenticated: false }
	: { user: null, token: null, isAuthenticated: false };

// Create the auth store
const createAuthStore = () => {
	const { subscribe, set, update } = writable(storedAuth);

	return {
		subscribe,
		login: (userData, token) => {
			const authData = {
				user: userData,
				token,
				isAuthenticated: true
			};

			if (browser) {
				localStorage.setItem('auth', JSON.stringify(authData));
			}

			set(authData);
		},
		logout: () => {
			if (browser) {
				localStorage.clear()
			}

			set({ user: null, token: null, isAuthenticated: false });
		},
		updateUser: (userData) => {
			update((state) => {
				const updatedState = {
					...state,
					user: { ...state.user, ...userData }
				};

				if (browser) {
					localStorage.setItem('auth', JSON.stringify(updatedState));
				}

				return updatedState;
			});
		}
	};
};

export const auth = createAuthStore();

// Derived store to check if user is authenticated
export const isAuthenticated = derived(auth, ($auth) => $auth.isAuthenticated);

// Derived store to get user roles
export const userRoles = derived(auth, ($auth) => $auth.user?.roles || []);
