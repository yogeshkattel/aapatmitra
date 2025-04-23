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
		notifications: 0,
		emergencies: 0
	};

	// Mock data for reports
	let recentReports = [
		{
			id: 'REP-001',
			title: 'Working Condition Complaint',
			status: 'In Progress',
			date: '2023-04-15',
			country: 'Qatar'
		},
		{
			id: 'REP-002',
			title: 'Wage Issue Report',
			status: 'Resolved',
			date: '2023-04-02',
			country: 'UAE'
		},
		{
			id: 'REP-003',
			title: 'Housing Condition Report',
			status: 'Pending',
			date: '2023-04-10',
			country: 'Saudi Arabia'
		}
	];

	// Mock data for emergency contacts
	let emergencyContacts = [
		{
			name: 'Nepal Embassy - Qatar',
			number: '+974 4467 1927',
			country: 'Qatar'
		},
		{
			name: 'Nepal Embassy - UAE',
			number: '+971 2 634 4385',
			country: 'UAE'
		},
		{
			name: 'Nepal Labor Office',
			number: '+977 1 4211432',
			country: 'Nepal'
		}
	];

	// Mock data for resources
	let resources = [
		{
			title: 'Worker Rights Guide',
			description: 'Comprehensive guide to your rights as a migrant worker',
			url: '/resources/worker-rights',
			type: 'PDF'
		},
		{
			title: 'Emergency Protocols',
			description: 'Steps to follow in case of emergency situations',
			url: '/resources/emergency-protocols',
			type: 'Guide'
		},
		{
			title: 'Health Insurance Information',
			description: 'Information about health coverage and medical assistance',
			url: '/resources/health-insurance',
			type: 'Article'
		}
	];

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
				notifications: 3,
				emergencies: 2
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
		<!-- Welcome Message -->
		<div class="mb-8 overflow-hidden rounded-lg bg-indigo-50 p-6 shadow">
			<div class="flex flex-wrap items-center justify-between">
				<div>
					<h2 class="text-xl font-semibold text-indigo-800">Welcome to Your Dashboard</h2>
					<p class="mt-2 text-indigo-600">
						This is your personal hub for accessing resources, submitting reports, and managing
						emergency situations.
					</p>
					<div class="mt-4">
						<p class="font-medium text-gray-700">
							Profile Status: <span class="text-green-600">Complete</span>
						</p>
					</div>
				</div>
				<div class="mt-4 md:mt-0">
					<a
						href="/dashboard/profile"
						class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
					>
						<svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
							/>
						</svg>
						View Profile
					</a>
				</div>
			</div>
		</div>

		<!-- Stats Cards - Horizontal Grid Layout -->
		<h2 class="mb-4 text-xl font-semibold text-gray-800">Overview</h2>
		<div class="mb-8 grid grid-cols-4 gap-4 overflow-x-auto pb-2">
			<!-- Reports Card -->
			<div
				class="flex min-w-[200px] overflow-hidden rounded-lg bg-white shadow transition-transform hover:translate-y-[-3px]"
			>
				<div class="flex items-center justify-center bg-indigo-100 px-5">
					<svg
						class="h-8 w-8 text-indigo-600"
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
				<div class="flex-1 p-4">
					<h2 class="text-lg font-semibold text-gray-700">Reports</h2>
					<p class="text-2xl font-bold text-gray-900">{stats.reports}</p>
					<div class="mt-3">
						<a href="/dashboard/reports" class="text-sm text-indigo-600 hover:text-indigo-800"
							>View all reports →</a
						>
					</div>
				</div>
			</div>

			<!-- Resources Card -->
			<div
				class="flex min-w-[200px] overflow-hidden rounded-lg bg-white shadow transition-transform hover:translate-y-[-3px]"
			>
				<div class="flex items-center justify-center bg-green-100 px-5">
					<svg class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
						/>
					</svg>
				</div>
				<div class="flex-1 p-4">
					<h2 class="text-lg font-semibold text-gray-700">Resources</h2>
					<p class="text-2xl font-bold text-gray-900">{stats.resources}</p>
					<div class="mt-3">
						<a href="/dashboard/resources" class="text-sm text-green-600 hover:text-green-800"
							>View all resources →</a
						>
					</div>
				</div>
			</div>

			<!-- Emergencies Card -->
			<div
				class="flex min-w-[200px] overflow-hidden rounded-lg bg-white shadow transition-transform hover:translate-y-[-3px]"
			>
				<div class="flex items-center justify-center bg-red-100 px-5">
					<svg class="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						/>
					</svg>
				</div>
				<div class="flex-1 p-4">
					<h2 class="text-lg font-semibold text-gray-700">Emergencies</h2>
					<p class="text-2xl font-bold text-gray-900">{stats.emergencies}</p>
					<div class="mt-3">
						<a href="/dashboard/emergency" class="text-sm text-red-600 hover:text-red-800"
							>View emergencies →</a
						>
					</div>
				</div>
			</div>

			<!-- Notifications Card -->
			<div
				class="flex min-w-[200px] overflow-hidden rounded-lg bg-white shadow transition-transform hover:translate-y-[-3px]"
			>
				<div class="flex items-center justify-center bg-yellow-100 px-5">
					<svg
						class="h-8 w-8 text-yellow-600"
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
				<div class="flex-1 p-4">
					<h2 class="text-lg font-semibold text-gray-700">Notifications</h2>
					<p class="text-2xl font-bold text-gray-900">{stats.notifications}</p>
					<div class="mt-3">
						<a href="/dashboard/notifications" class="text-sm text-yellow-600 hover:text-yellow-800"
							>View all notifications →</a
						>
					</div>
				</div>
			</div>
		</div>

		<!-- Recent Reports Section - Horizontal Grid Layout -->
		<div class="mb-8">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-xl font-semibold text-gray-800">Recent Reports</h2>
				<a
					href="/dashboard/reports"
					class="text-sm font-medium text-indigo-600 hover:text-indigo-800">View All</a
				>
			</div>

			<div class="grid grid-cols-3 gap-4 overflow-x-auto pb-2">
				{#each recentReports as report}
					<div
						class="min-w-[250px] overflow-hidden rounded-lg bg-white shadow transition-transform hover:translate-y-[-3px]"
					>
						<div class="flex h-full flex-col">
							<div class="flex-1 p-5">
								<div class="flex items-center justify-between">
									<span class="text-xs font-medium text-gray-500">{report.id}</span>
									{#if report.status === 'Resolved'}
										<span
											class="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800"
										>
											{report.status}
										</span>
									{:else if report.status === 'In Progress'}
										<span
											class="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
										>
											{report.status}
										</span>
									{:else}
										<span
											class="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800"
										>
											{report.status}
										</span>
									{/if}
								</div>
								<h3 class="mt-2 text-lg font-medium text-gray-900">{report.title}</h3>
								<div class="mt-2 flex items-center text-sm text-gray-500">
									<svg class="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
										/>
									</svg>
									{report.date}
								</div>
								<div class="mt-1 flex items-center text-sm text-gray-500">
									<svg class="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
									{report.country}
								</div>
							</div>
							<div class="mt-auto border-t border-gray-100 bg-gray-50 p-4">
								<a
									href={`/dashboard/reports/${report.id}`}
									class="inline-flex items-center rounded-md bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
								>
									View Details
								</a>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Features Section (replacing emergency contacts) -->
		<div class="mb-8">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-xl font-semibold text-gray-800">Features</h2>
			</div>

			<div class="grid grid-cols-3 gap-4 overflow-x-auto pb-2">
				<!-- Emergency Feature -->
				<div
					class="min-w-[250px] overflow-hidden rounded-lg bg-white shadow transition-transform hover:translate-y-[-3px]"
				>
					<div class="flex-none bg-red-100 p-4">
						<svg class="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
							/>
						</svg>
					</div>
					<div class="flex-1 p-4">
						<h3 class="text-lg font-medium text-gray-900">Emergency Help</h3>
						<p class="mt-1 text-sm text-gray-600">
							Quick access to emergency services and support in crisis situations.
						</p>
						<div class="mt-4">
							<a
								href="/dashboard/emergency"
								class="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-800"
							>
								Get Help →
							</a>
						</div>
					</div>
				</div>

				<!-- Reports Feature -->
				<div
					class="min-w-[250px] overflow-hidden rounded-lg bg-white shadow transition-transform hover:translate-y-[-3px]"
				>
					<div class="flex-none bg-blue-100 p-4">
						<svg
							class="h-8 w-8 text-blue-600"
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
					<div class="flex-1 p-4">
						<h3 class="text-lg font-medium text-gray-900">Submit Reports</h3>
						<p class="mt-1 text-sm text-gray-600">
							Report issues or concerns about your working or living conditions.
						</p>
						<div class="mt-4">
							<a
								href="/dashboard/reports/new"
								class="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
							>
								Create Report →
							</a>
						</div>
					</div>
				</div>

				<!-- Resources Feature -->
				<div
					class="min-w-[250px] overflow-hidden rounded-lg bg-white shadow transition-transform hover:translate-y-[-3px]"
				>
					<div class="flex-none bg-green-100 p-4">
						<svg
							class="h-8 w-8 text-green-600"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
							/>
						</svg>
					</div>
					<div class="flex-1 p-4">
						<h3 class="text-lg font-medium text-gray-900">Knowledge Resources</h3>
						<p class="mt-1 text-sm text-gray-600">
							Access guides, documents and information to help protect your rights.
						</p>
						<div class="mt-4">
							<a
								href="/dashboard/resources"
								class="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-800"
							>
								Browse Resources →
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Resources Section - Horizontal Grid Layout -->
		<div class="mb-8">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-xl font-semibold text-gray-800">Resources</h2>
				<a
					href="/dashboard/resources"
					class="text-sm font-medium text-indigo-600 hover:text-indigo-800">View All</a
				>
			</div>

			<div class="grid grid-cols-3 gap-4 overflow-x-auto pb-2">
				{#each resources as resource}
					<div
						class="min-w-[250px] overflow-hidden rounded-lg bg-white shadow transition-transform hover:translate-y-[-3px]"
					>
						<div class="flex h-full flex-col">
							<div class="flex-1 p-4">
								<div class="flex items-center justify-between">
									<h3 class="text-lg font-medium text-gray-900">{resource.title}</h3>
									<span
										class="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800"
									>
										{resource.type}
									</span>
								</div>
								<p class="mt-2 text-sm text-gray-600">{resource.description}</p>
							</div>
							<div class="mt-auto border-t border-gray-100 bg-gray-50 p-4">
								<a
									href={resource.url}
									class="inline-flex items-center rounded-md bg-green-50 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-100"
								>
									<svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
										/>
									</svg>
									Access Resource
								</a>
							</div>
						</div>
					</div>
				{/each}
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
