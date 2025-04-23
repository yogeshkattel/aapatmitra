<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let profileData = {
		id: null,
		createdAt: null,
		isActive: true,
		picture: {
			id: null,
			createdAt: null,
			isActive: true,
			image: null,
			name: 'profile_picture',
			user: null,
			report: null
		},
		user: {
			userId: null,
			email: '',
			fullName: '',
			userType: 'normal',
			type: 'normal'
		},
		phone: '',
		type: 'normal',
		metaData: {
			country: '',
			isForeignEmployed: false,
			familyContactNumber: ''
		}
	};

	let loading = true;
	let error = null;
	let saving = false;
	let saveSuccess = false;
	let imageFile = null;
	let imagePreview = null;
	const API_BASE_URL = 'http://127.0.0.1:8000';

	// Handle image upload
	function handleImageChange(event) {
		const file = event.target.files[0];
		if (file) {
			imageFile = file;
			const reader = new FileReader();
			reader.onload = (e) => {
				imagePreview = e.target.result;
			};
			reader.readAsDataURL(file);
		}
	}

	// Countries list for dropdown
	const countries = [
		'Afghanistan',
		'Albania',
		'Algeria',
		'Bangladesh',
		'Bhutan',
		'Cambodia',
		'China',
		'Egypt',
		'Ethiopia',
		'India',
		'Indonesia',
		'Jordan',
		'Kenya',
		'Kuwait',
		'Lebanon',
		'Malaysia',
		'Myanmar',
		'Nepal',
		'Nigeria',
		'Pakistan',
		'Philippines',
		'Qatar',
		'Saudi Arabia',
		'Singapore',
		'Sri Lanka',
		'Thailand',
		'UAE',
		'Vietnam'
	];

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
					// Set the profile data
					profileData = result.data;

					// Initialize metaData if it doesn't exist
					if (!profileData.metaData) {
						profileData.metaData = {
							country: '',
							isForeignEmployed: false,
							familyContactNumber: ''
						};
					}

					// Set image preview if profile has a picture
					if (profileData.picture && profileData.picture.image) {
						imagePreview = `${API_BASE_URL}/api/${profileData.picture.image}`;
					}
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

	// Function to update the profile
	async function updateProfile() {
		saving = true;
		error = '';
		saveSuccess = false;

		try {
			let token = localStorage.getItem('token');
			if (!token) {
				const authData = localStorage.getItem('auth');
				if (authData) {
					try {
						const parsed = JSON.parse(authData);
						token = parsed.token;
					} catch (e) {
						console.error('Error parsing auth data:', e);
					}
				}
			}

			if (!token) {
				error = 'No authentication token found.';
				saving = false;
				return;
			}

			// Create form data if there's an image file
			let data;
			if (imageFile) {
				data = new FormData();
				data.append('image', imageFile);

				// Add other profile data as JSON
				const profileJson = JSON.stringify({
					fullName: profileData.user.fullName,
					phone: profileData.phone,
					metaData: profileData.metaData
				});
				data.append('data', profileJson);
			} else {
				// Just send JSON data if no image
				data = {
					fullName: profileData.user.fullName,
					phone: profileData.phone,
					metaData: profileData.metaData
				};
			}

			// Determine content type based on data type
			const headers = {
				Authorization: `Bearer ${token}`,
				Accept: 'application/json'
			};

			if (!(data instanceof FormData)) {
				headers['Content-Type'] = 'application/json';
			}

			const response = await fetch(`${API_BASE_URL}/profile/update`, {
				method: 'PUT',
				headers,
				body: data instanceof FormData ? data : JSON.stringify(data),
				mode: 'cors'
			});

			if (!response.ok) {
				if (response.status === 401) {
					error = 'Your session has expired. Please log in again.';
					saving = false;
					return;
				}

				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();

			if (result.success) {
				saveSuccess = true;
				setTimeout(() => {
					goto('/dashboard/profile');
				}, 1500);
			} else {
				error = result.message || 'Failed to update profile';
			}
		} catch (err) {
			console.error('Error updating profile:', err);
			error = 'Failed to update profile. Please try again.';
		} finally {
			saving = false;
		}
	}

	function handleSubmit(e) {
		e.preventDefault();
		updateProfile();
	}

	onMount(() => {
		if (browser) {
			fetchProfile();
		}
	});
</script>

<div class="container mx-auto px-4 py-6">
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-2xl font-bold text-gray-800">Edit Profile</h1>
		<a
			href="/dashboard/profile"
			class="inline-flex items-center rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-300"
		>
			<svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 19l-7-7m0 0l7-7m-7 7h18"
				/>
			</svg>
			Back to Profile
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
					<h3 class="text-sm font-medium text-red-800">Error</h3>
					<div class="mt-2 text-sm text-red-700">
						<p>{error}</p>
					</div>
				</div>
			</div>
		</div>
	{:else}
		{#if saveSuccess}
			<div class="mx-auto mb-6 max-w-2xl rounded-md bg-green-50 p-4 shadow">
				<div class="flex">
					<div class="flex-shrink-0">
						<svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
					<div class="ml-3">
						<h3 class="text-sm font-medium text-green-800">Success</h3>
						<div class="mt-2 text-sm text-green-700">
							<p>Your profile has been updated successfully. Redirecting to profile page...</p>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<form on:submit={handleSubmit} class="space-y-8">
			<!-- Profile Picture -->
			<div class="overflow-hidden rounded-lg bg-white shadow">
				<div class="border-b border-gray-200 bg-gray-50 px-4 py-4">
					<h2 class="text-lg font-semibold text-gray-800">Profile Picture</h2>
				</div>
				<div class="px-4 py-5">
					<div class="flex flex-col items-center space-y-4">
						<div class="h-32 w-32 overflow-hidden rounded-full bg-indigo-100">
							{#if imagePreview}
								<img src={imagePreview} alt="Profile" class="h-full w-full object-cover" />
							{:else}
								<div class="flex h-full w-full items-center justify-center">
									<span class="text-4xl font-bold text-indigo-600">
										{profileData.user?.fullName ? profileData.user.fullName.charAt(0) : ''}
									</span>
								</div>
							{/if}
						</div>
						<div class="w-full max-w-xs">
							<label class="block text-sm font-medium text-gray-700"> Upload new picture </label>
							<div
								class="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5"
							>
								<div class="space-y-1 text-center">
									<svg
										class="mx-auto h-12 w-12 text-gray-400"
										stroke="currentColor"
										fill="none"
										viewBox="0 0 48 48"
										aria-hidden="true"
									>
										<path
											d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</svg>
									<div class="flex text-sm text-gray-600">
										<label
											for="file-upload"
											class="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
										>
											<span>Upload a file</span>
											<input
												id="file-upload"
												name="file-upload"
												type="file"
												accept="image/*"
												class="sr-only"
												on:change={handleImageChange}
											/>
										</label>
										<p class="pl-1">or drag and drop</p>
									</div>
									<p class="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Personal Information -->
			<div class="overflow-hidden rounded-lg bg-white shadow">
				<div class="border-b border-gray-200 bg-gray-50 px-4 py-4">
					<h2 class="text-lg font-semibold text-gray-800">Personal Information</h2>
				</div>
				<div class="px-4 py-5">
					<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div>
							<label for="fullName" class="block text-sm font-medium text-gray-700"
								>Full Name <span class="text-red-500">*</span></label
							>
							<input
								type="text"
								id="fullName"
								bind:value={profileData.user.fullName}
								required
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							/>
						</div>

						<div>
							<label for="email" class="block text-sm font-medium text-gray-700"
								>Email Address</label
							>
							<input
								type="email"
								id="email"
								value={profileData.user.email}
								readonly
								class="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							/>
							<p class="mt-1 text-xs text-gray-500">Email address cannot be changed</p>
						</div>

						<div>
							<label for="phone" class="block text-sm font-medium text-gray-700"
								>Phone Number <span class="text-red-500">*</span></label
							>
							<input
								type="tel"
								id="phone"
								bind:value={profileData.phone}
								required
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							/>
						</div>

						<div>
							<label for="userType" class="block text-sm font-medium text-gray-700">User Type</label
							>
							<input
								type="text"
								id="userType"
								value={profileData.type}
								readonly
								class="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							/>
							<p class="mt-1 text-xs text-gray-500">User type cannot be changed</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Additional Information -->
			<div class="overflow-hidden rounded-lg bg-white shadow">
				<div class="border-b border-gray-200 bg-gray-50 px-4 py-4">
					<h2 class="text-lg font-semibold text-gray-800">Additional Information</h2>
				</div>
				<div class="px-4 py-5">
					<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div>
							<label for="country" class="block text-sm font-medium text-gray-700"
								>Country <span class="text-red-500">*</span></label
							>
							<select
								id="country"
								bind:value={profileData.metaData.country}
								required
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							>
								<option value="">Select Country</option>
								{#each countries as country}
									<option value={country}>{country}</option>
								{/each}
							</select>
						</div>

						<div>
							<label for="familyContactNumber" class="block text-sm font-medium text-gray-700"
								>Family Contact Number <span class="text-red-500">*</span></label
							>
							<input
								type="tel"
								id="familyContactNumber"
								bind:value={profileData.metaData.familyContactNumber}
								required
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							/>
						</div>

						<div class="col-span-1 md:col-span-2">
							<div class="flex items-start">
								<div class="flex h-5 items-center">
									<input
										id="isForeignEmployed"
										type="checkbox"
										bind:checked={profileData.metaData.isForeignEmployed}
										class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
									/>
								</div>
								<div class="ml-3 text-sm">
									<label for="isForeignEmployed" class="font-medium text-gray-700"
										>Foreign Employment Status</label
									>
									<p class="text-gray-500">
										Check this box if you are currently employed in a foreign country.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Account Information (Read-only) -->
			<div class="overflow-hidden rounded-lg bg-white shadow">
				<div class="border-b border-gray-200 bg-gray-50 px-4 py-4">
					<h2 class="text-lg font-semibold text-gray-800">Account Information (Read-only)</h2>
				</div>
				<div class="bg-gray-50 px-4 py-5">
					<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div>
							<label for="userId" class="block text-sm font-medium text-gray-700">User ID</label>
							<input
								type="text"
								id="userId"
								value={profileData.user.userId}
								readonly
								class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							/>
						</div>

						<div>
							<label for="profileId" class="block text-sm font-medium text-gray-700"
								>Profile ID</label
							>
							<input
								type="text"
								id="profileId"
								value={profileData.id}
								readonly
								class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							/>
						</div>

						<div>
							<label for="createdAt" class="block text-sm font-medium text-gray-700"
								>Profile Created</label
							>
							<input
								type="text"
								id="createdAt"
								value={new Date(profileData.createdAt).toLocaleDateString()}
								readonly
								class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							/>
						</div>

						<div>
							<label for="accountStatus" class="block text-sm font-medium text-gray-700"
								>Account Status</label
							>
							<input
								type="text"
								id="accountStatus"
								value={profileData.isActive ? 'Active' : 'Inactive'}
								readonly
								class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							/>
						</div>
					</div>
				</div>
			</div>

			<!-- Submit Buttons -->
			<div class="flex justify-end space-x-3">
				<a
					href="/dashboard/profile"
					class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
				>
					Cancel
				</a>
				<button
					type="submit"
					disabled={saving}
					class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
				>
					{#if saving}
						<svg
							class="-ml-1 mr-2 h-4 w-4 animate-spin"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							/>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							/>
						</svg>
						Saving...
					{:else}
						Save Changes
					{/if}
				</button>
			</div>
		</form>
	{/if}
</div>
