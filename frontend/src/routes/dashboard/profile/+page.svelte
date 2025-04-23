<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let profileData = null;
	let loading = true;
	let error = null;
	const API_BASE_URL = 'http://127.0.0.1:8000';

	// Function to fetch the profile
	async function fetchProfile() {
		try {
			// Check for token
			let token = browser ? localStorage.getItem('token') : null;

			if (!token && browser) {
				const authData = localStorage.getItem('auth');
				if (authData) {
					try {
						const parsed = JSON.parse(authData);
						token = parsed.token;
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

			const response = await fetch(`${API_BASE_URL}/profile`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
					Accept: 'application/json'
				},
				mode: 'cors',
				cache: 'no-store'
			});

			if (!response.ok) {
				if (response.status === 401) {
					error = 'Your session has expired. Please log in again.';
					loading = false;
					return;
				}

				if (response.status === 0) {
					console.error('CORS error detected - Network error');
					error = 'A network error occurred. Please ensure the server is running.';
					loading = false;
					return;
				}

				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();

			if (result.success) {
				if (result.data === null) {
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

	onMount(() => {
		if (browser) {
			fetchProfile();
		}
	});
</script>

<div class="container mx-auto px-4 py-6">
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-2xl font-bold text-gray-800">Profile Details</h1>
		<a
			href="/dashboard/profile/edit"
			class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
		>
			<svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
				/>
			</svg>
			Edit Profile
		</a>
	</div>

	{#if loading}
		<div class="flex items-center justify-center p-6">
			<div
				class="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-indigo-500"
			></div>
			<span class="ml-3 text-gray-600">Loading your profile...</span>
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
	{:else if profileData}
		<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
			<!-- Personal Information -->
			<div class="col-span-1 overflow-hidden rounded-lg bg-white shadow">
				<div class="border-b border-gray-200 bg-gray-50 px-4 py-4">
					<h2 class="text-lg font-semibold text-gray-800">Personal Information</h2>
				</div>
				<div class="px-4 py-5">
					<div class="mb-4 flex items-center justify-center">
						<div class="h-24 w-24 overflow-hidden rounded-full bg-indigo-100">
							{#if profileData.picture && profileData.picture.image}
								<img
									src={`${API_BASE_URL}/${profileData.picture.image}`}
									alt="Profile"
									class="h-full w-full object-cover"
								/>
							{:else}
								<div class="flex h-full w-full items-center justify-center">
									<span class="text-3xl font-bold text-indigo-600">
										{profileData.user?.fullName ? profileData.user.fullName.charAt(0) : ''}
									</span>
								</div>
							{/if}
						</div>
					</div>

					<div class="mt-6 space-y-4">
						<div>
							<h3 class="text-sm font-medium text-gray-500">Full Name</h3>
							<p class="mt-1 text-base text-gray-900">
								{profileData.user?.fullName || 'Not provided'}
							</p>
						</div>
						<div>
							<h3 class="text-sm font-medium text-gray-500">Email</h3>
							<p class="mt-1 text-base text-gray-900">
								{profileData.user?.email || 'Not provided'}
							</p>
						</div>
						<div>
							<h3 class="text-sm font-medium text-gray-500">Phone</h3>
							<p class="mt-1 text-base text-gray-900">{profileData.phone || 'Not provided'}</p>
						</div>
						<div>
							<h3 class="text-sm font-medium text-gray-500">User Type</h3>
							<p class="mt-1 text-base text-gray-900">{profileData.type || 'Not provided'}</p>
						</div>
						<div>
							<h3 class="text-sm font-medium text-gray-500">User ID</h3>
							<p class="mt-1 text-base text-gray-900">
								{profileData.user?.userId || 'Not provided'}
							</p>
						</div>
						<div>
							<h3 class="text-sm font-medium text-gray-500">Created At</h3>
							<p class="mt-1 text-base text-gray-900">
								{new Date(profileData.createdAt).toLocaleDateString() || 'Not provided'}
							</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Additional Information -->
			<div class="col-span-1 overflow-hidden rounded-lg bg-white shadow">
				<div class="border-b border-gray-200 bg-gray-50 px-4 py-4">
					<h2 class="text-lg font-semibold text-gray-800">Additional Information</h2>
				</div>
				<div class="px-4 py-5">
					<div class="space-y-4">
						<div>
							<h3 class="text-sm font-medium text-gray-500">Country</h3>
							<p class="mt-1 text-base text-gray-900">
								{profileData.metaData?.country || 'Not provided'}
							</p>
						</div>
						<div>
							<h3 class="text-sm font-medium text-gray-500">Foreign Employment Status</h3>
							<p class="mt-1 text-base text-gray-900">
								{profileData.metaData?.isForeignEmployed ? 'Yes' : 'No'}
							</p>
						</div>
						<div>
							<h3 class="text-sm font-medium text-gray-500">Family Contact Number</h3>
							<p class="mt-1 text-base text-gray-900">
								{profileData.metaData?.familyContactNumber || 'Not provided'}
							</p>
						</div>
						<div>
							<h3 class="text-sm font-medium text-gray-500">Profile ID</h3>
							<p class="mt-1 text-base text-gray-900">
								{profileData.id || 'Not provided'}
							</p>
						</div>
						<div>
							<h3 class="text-sm font-medium text-gray-500">Status</h3>
							<p class="mt-1 text-base text-gray-900">
								{profileData.isActive ? 'Active' : 'Inactive'}
							</p>
						</div>
					</div>
				</div>
			</div>

			<!-- User Account Information -->
			<div class="col-span-1 overflow-hidden rounded-lg bg-white shadow">
				<div class="border-b border-gray-200 bg-gray-50 px-4 py-4">
					<h2 class="text-lg font-semibold text-gray-800">Account Information</h2>
				</div>
				<div class="px-4 py-5">
					<div class="space-y-4">
						<div>
							<h3 class="text-sm font-medium text-gray-500">User ID</h3>
							<p class="mt-1 text-base text-gray-900">
								{profileData.user?.id || 'Not provided'}
							</p>
						</div>
						<div>
							<h3 class="text-sm font-medium text-gray-500">Account Type</h3>
							<p class="mt-1 text-base text-gray-900">
								{profileData.user?.userType || 'Not provided'}
							</p>
						</div>
						<div>
							<h3 class="text-sm font-medium text-gray-500">Provider</h3>
							<p class="mt-1 text-base text-gray-900">
								{profileData.user?.provider || 'Standard'}
							</p>
						</div>
						<div>
							<h3 class="text-sm font-medium text-gray-500">Account Status</h3>
							<p class="mt-1 text-base text-gray-900">
								{profileData.user?.blocked ? 'Blocked' : 'Active'}
							</p>
						</div>
						{#if profileData.user?.blocked_reason}
							<div>
								<h3 class="text-sm font-medium text-gray-500">Block Reason</h3>
								<p class="mt-1 text-base text-gray-900">
									{profileData.user.blocked_reason}
								</p>
							</div>
						{/if}
						<div>
							<h3 class="text-sm font-medium text-gray-500">Account Created</h3>
							<p class="mt-1 text-base text-gray-900">
								{new Date(profileData.user?.createdAt).toLocaleDateString() || 'Not provided'}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<div class="rounded-lg bg-yellow-50 p-4 shadow">
			<div class="flex">
				<div class="flex-shrink-0">
					<svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
						<path
							fill-rule="evenodd"
							d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
				<div class="ml-3">
					<h3 class="text-sm font-medium text-yellow-800">No Profile Found</h3>
					<div class="mt-2 text-sm text-yellow-700">
						<p>You don't have a profile set up yet. Please create your profile.</p>
					</div>
					<div class="mt-4">
						<a
							href="/dashboard/create-profile"
							class="inline-flex items-center rounded-md bg-yellow-100 px-3 py-2 text-sm font-medium text-yellow-800 hover:bg-yellow-200"
						>
							Create Profile
						</a>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
