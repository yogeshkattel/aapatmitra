<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth.store';
	import { onMount } from 'svelte';

	let profileData = null;
	let loading = true;
	let error = null;

	// Stats for dashboard cards
	let stats = {
		reports: 0,
		resources: 0,
		notifications: 0
	};

	// Function to fetch the profile
	async function fetchProfile() {
		try {
			// Check for token - first check token directly, then check auth store
			let token = browser ? localStorage.getItem('token') : null;

			console.log('Profile fetch - Direct token exists:', !!token);

			// If no token, try to get from auth store
			if (!token && browser) {
				const authData = localStorage.getItem('auth');
				if (authData) {
					try {
						const parsed = JSON.parse(authData);
						token = parsed.token;
						console.log('Profile fetch - Parsed auth token:', !!token);

						// If we found a token in the auth store but not in direct storage,
						// let's fix that inconsistency
						if (token) {
							localStorage.setItem('token', token);
						}
					} catch (e) {
						console.error('Error parsing auth data:', e);
					}
				}
			}

			if (!token) {
				error = 'No authentication token found.';
				loading = false;
				return;
			}

			// Use full URL to avoid relative path issues
			const API_BASE_URL = 'http://127.0.0.1:8000'; // Update with your actual API URL
			const response = await fetch(`${API_BASE_URL}/profile`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
					// Add additional headers for CORS
					Accept: 'application/json'
				},
				// Don't use credentials: 'include' with CORS requests that include Authorization header
				mode: 'cors',
				// Set cache to no-store to avoid caching issues
				cache: 'no-store'
			});

			if (!response.ok) {
				if (response.status === 401) {
					error = 'Your session has expired. Please log in again.';
					loading = false;
					return;
				}

				// Special handling for CORS errors
				if (response.status === 0) {
					console.error('CORS error detected - Network error');
					error =
						'A network error occurred. This might be due to CORS restrictions. Please ensure the backend server is running and correctly configured.';
					loading = false;
					return;
				}

				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();

			if (result.success) {
				if (result.data === null) {
					// Redirect to profile creation page instead of showing a prompt
					console.log('No profile data found - redirecting to create profile page');
					goto('/dashboard/create-profile');
					return;
				} else {
					profileData = result.data;
				}
			} else {
				error = result.message || 'Failed to load profile';
			}
		} catch (err) {
			console.error('Error fetching profile:', err);
			error = 'Failed to fetch profile data. Please try again.';
		} finally {
			loading = false;
		}
	}

	// Fetch some mock stats for the dashboard
	function fetchStats() {
		// This would be an actual API call in a real app
		setTimeout(() => {
			stats = {
				reports: 5,
				resources: 12,
				notifications: 3
			};
		}, 500);
	}

	onMount(() => {
		if (browser) {
			fetchProfile();
			fetchStats();
		}
	});
</script>

<div class="container mx-auto">
	<h1 class="mb-6 text-2xl font-bold text-gray-800">Dashboard</h1>

	{#if loading}
		<div class="flex items-center justify-center p-6">
			<div
				class="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-indigo-500"
			></div>
			<span class="ml-3 text-gray-600">Loading your dashboard...</span>
		</div>
	{:else if error}
		<div class="mx-auto max-w-2xl rounded-md bg-red-50 p-4 shadow">
			<div class="flex">
				<div class="flex-shrink-0">
					<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
				<div class="ml-3">
					<h3 class="text-sm font-medium text-red-800">Alert</h3>
					<div class="mt-2 text-sm text-red-700">
						<p>{error}</p>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<!-- Dashboard Content -->
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			<!-- Stats Cards -->
			<div class="overflow-hidden rounded-lg bg-white p-6 shadow">
				<div class="flex items-center">
					<div class="rounded-full bg-indigo-100 p-3">
						<svg
							class="h-6 w-6 text-indigo-600"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
					</div>
					<div class="ml-4">
						<h2 class="text-lg font-semibold text-gray-700">Reports</h2>
						<p class="text-2xl font-bold text-gray-900">{stats.reports}</p>
					</div>
				</div>
			</div>

			<div class="overflow-hidden rounded-lg bg-white p-6 shadow">
				<div class="flex items-center">
					<div class="rounded-full bg-green-100 p-3">
						<svg
							class="h-6 w-6 text-green-600"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
							/>
						</svg>
					</div>
					<div class="ml-4">
						<h2 class="text-lg font-semibold text-gray-700">Resources</h2>
						<p class="text-2xl font-bold text-gray-900">{stats.resources}</p>
					</div>
				</div>
			</div>

			<div class="overflow-hidden rounded-lg bg-white p-6 shadow">
				<div class="flex items-center">
					<div class="rounded-full bg-yellow-100 p-3">
						<svg
							class="h-6 w-6 text-yellow-600"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
							/>
						</svg>
					</div>
					<div class="ml-4">
						<h2 class="text-lg font-semibold text-gray-700">Notifications</h2>
						<p class="text-2xl font-bold text-gray-900">{stats.notifications}</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Welcome Message -->
		<div class="mt-6 overflow-hidden rounded-lg bg-indigo-50 p-6 shadow">
			<h2 class="text-xl font-semibold text-indigo-800">Welcome to Your Dashboard</h2>
			<p class="mt-2 text-indigo-600">
				This is your personal hub for accessing resources, submitting reports, and managing your
				profile.
			</p>
			<div class="mt-4">
				<p class="font-medium text-gray-700">
					Profile Status: <span class="text-green-600">Complete</span>
				</p>
			</div>
		</div>

		<!-- Recent Activity -->
		<div class="mt-6 overflow-hidden rounded-lg bg-white p-6 shadow">
			<h2 class="mb-4 text-xl font-semibold text-gray-800">Recent Activity</h2>
			<div class="space-y-4">
				<div class="flex items-start">
					<div class="flex-shrink-0">
						<div class="rounded-full bg-blue-100 p-2">
							<svg
								class="h-4 w-4 text-blue-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 6v6m0 0v6m0-6h6m-6 0H6"
								/>
							</svg>
						</div>
					</div>
					<div class="ml-3">
						<p class="text-sm font-medium text-gray-900">You created a new report</p>
						<p class="text-sm text-gray-500">Yesterday at 2:30 PM</p>
					</div>
				</div>

				<div class="flex items-start">
					<div class="flex-shrink-0">
						<div class="rounded-full bg-green-100 p-2">
							<svg
								class="h-4 w-4 text-green-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 13l4 4L19 7"
								/>
							</svg>
						</div>
					</div>
					<div class="ml-3">
						<p class="text-sm font-medium text-gray-900">Your profile was updated</p>
						<p class="text-sm text-gray-500">3 days ago</p>
					</div>
				</div>

				<div class="flex items-start">
					<div class="flex-shrink-0">
						<div class="rounded-full bg-yellow-100 p-2">
							<svg
								class="h-4 w-4 text-yellow-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
								/>
							</svg>
						</div>
					</div>
					<div class="ml-3">
						<p class="text-sm font-medium text-gray-900">New notification received</p>
						<p class="text-sm text-gray-500">1 week ago</p>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	/* Ensure basic styling is applied even if Tailwind isn't loading */
	:global(body) {
		margin: 0;
		padding: 0;
		font-family:
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			Roboto,
			sans-serif;
	}

	:global(.container) {
		width: 100%;
		max-width: 1200px;
		margin-left: auto;
		margin-right: auto;
		padding-left: 1rem;
		padding-right: 1rem;
	}

	:global(.bg-white) {
		background-color: white;
	}

	:global(.rounded-lg) {
		border-radius: 0.5rem;
	}

	:global(.shadow) {
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.1),
			0 2px 4px -1px rgba(0, 0, 0, 0.06);
	}

	:global(.p-6) {
		padding: 1.5rem;
	}

	:global(.mb-6) {
		margin-bottom: 1.5rem;
	}

	:global(.text-2xl) {
		font-size: 1.5rem;
		line-height: 2rem;
	}

	:global(.font-bold) {
		font-weight: 700;
	}

	:global(.text-gray-800) {
		color: #1f2937;
	}

	:global(.grid) {
		display: grid;
	}

	:global(.gap-6) {
		gap: 1.5rem;
	}

	:global(.flex) {
		display: flex;
	}

	:global(.items-center) {
		align-items: center;
	}

	:global(.justify-center) {
		justify-content: center;
	}

	@media (min-width: 640px) {
		:global(.sm\\:grid-cols-2) {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (min-width: 1024px) {
		:global(.lg\\:grid-cols-3) {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
</style>
