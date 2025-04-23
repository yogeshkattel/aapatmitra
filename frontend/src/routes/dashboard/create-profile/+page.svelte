<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth.store';
	import { onMount } from 'svelte';

	let loading = false;
	let error = null;
	let success = false;

	// Form data
	let formData = {
		isForeignEmployed: false,
		country: '',
		familyContactNumber: '',
		info: {
			picture: null,
			phone: ''
		}
	};

	// Country list for dropdown
	const countries = [
		'Afghanistan',
		'Albania',
		'Algeria',
		'Andorra',
		'Angola',
		'Antigua and Barbuda',
		'Argentina',
		'Armenia',
		'Australia',
		'Austria',
		'Azerbaijan',
		'Bahamas',
		'Bahrain',
		'Bangladesh',
		'Barbados',
		'Belarus',
		'Belgium',
		'Belize',
		'Benin',
		'Bhutan',
		'Bolivia',
		'Bosnia and Herzegovina',
		'Botswana',
		'Brazil',
		'Brunei',
		'Bulgaria',
		'Burkina Faso',
		'Burundi',
		'Cabo Verde',
		'Cambodia',
		'Cameroon',
		'Canada',
		'Central African Republic',
		'Chad',
		'Chile',
		'China',
		'Colombia',
		'Comoros',
		'Congo',
		'Costa Rica',
		'Croatia',
		'Cuba',
		'Cyprus',
		'Czech Republic',
		'Denmark',
		'Djibouti',
		'Dominica',
		'Dominican Republic',
		'Ecuador',
		'Egypt',
		'El Salvador',
		'Equatorial Guinea',
		'Eritrea',
		'Estonia',
		'Eswatini',
		'Ethiopia',
		'Fiji',
		'Finland',
		'France',
		'Gabon',
		'Gambia',
		'Georgia',
		'Germany',
		'Ghana',
		'Greece',
		'Grenada',
		'Guatemala',
		'Guinea',
		'Guinea-Bissau',
		'Guyana',
		'Haiti',
		'Honduras',
		'Hungary',
		'Iceland',
		'India',
		'Indonesia',
		'Iran',
		'Iraq',
		'Ireland',
		'Israel',
		'Italy',
		'Jamaica',
		'Japan',
		'Jordan',
		'Kazakhstan',
		'Kenya',
		'Kiribati',
		'Korea, North',
		'Korea, South',
		'Kosovo',
		'Kuwait',
		'Kyrgyzstan',
		'Laos',
		'Latvia',
		'Lebanon',
		'Lesotho',
		'Liberia',
		'Libya',
		'Liechtenstein',
		'Lithuania',
		'Luxembourg',
		'Madagascar',
		'Malawi',
		'Malaysia',
		'Maldives',
		'Mali',
		'Malta',
		'Marshall Islands',
		'Mauritania',
		'Mauritius',
		'Mexico',
		'Micronesia',
		'Moldova',
		'Monaco',
		'Mongolia',
		'Montenegro',
		'Morocco',
		'Mozambique',
		'Myanmar',
		'Namibia',
		'Nauru',
		'Nepal',
		'Netherlands',
		'New Zealand',
		'Nicaragua',
		'Niger',
		'Nigeria',
		'North Macedonia',
		'Norway',
		'Oman',
		'Pakistan',
		'Palau',
		'Palestine',
		'Panama',
		'Papua New Guinea',
		'Paraguay',
		'Peru',
		'Philippines',
		'Poland',
		'Portugal',
		'Qatar',
		'Romania',
		'Russia',
		'Rwanda',
		'Saint Kitts and Nevis',
		'Saint Lucia',
		'Saint Vincent and the Grenadines',
		'Samoa',
		'San Marino',
		'Sao Tome and Principe',
		'Saudi Arabia',
		'Senegal',
		'Serbia',
		'Seychelles',
		'Sierra Leone',
		'Singapore',
		'Slovakia',
		'Slovenia',
		'Solomon Islands',
		'Somalia',
		'South Africa',
		'South Sudan',
		'Spain',
		'Sri Lanka',
		'Sudan',
		'Suriname',
		'Sweden',
		'Switzerland',
		'Syria',
		'Taiwan',
		'Tajikistan',
		'Tanzania',
		'Thailand',
		'Timor-Leste',
		'Togo',
		'Tonga',
		'Trinidad and Tobago',
		'Tunisia',
		'Turkey',
		'Turkmenistan',
		'Tuvalu',
		'Uganda',
		'Ukraine',
		'United Arab Emirates',
		'United Kingdom',
		'United States',
		'Uruguay',
		'Uzbekistan',
		'Vanuatu',
		'Vatican City',
		'Venezuela',
		'Vietnam',
		'Yemen',
		'Zambia',
		'Zimbabwe'
	];

	// For image upload
	let selectedImage = null;
	let previewUrl = null;
	let imageId = null;

	// Handle image selection
	function handleImageSelect(event) {
		const file = event.target.files[0];
		if (file) {
			selectedImage = file;
			previewUrl = URL.createObjectURL(file);
		}
	}

	// Upload image
	async function uploadImage() {
		if (!selectedImage) return null;

		const formData = new FormData();
		formData.append('image', selectedImage);
		formData.append('name', 'profile_picture');

		try {
			const token = browser ? localStorage.getItem('token') : null;
			if (!token) throw new Error('No authentication token found');

			// Use the full URL to the API endpoint
			const API_BASE_URL = 'http://127.0.0.1:8000'; // Use your actual API URL
			const response = await fetch(`${API_BASE_URL}/imageupload`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`
				},
				body: formData,
				// Don't include credentials when there are CORS issues
				// credentials: 'include',
				mode: 'cors'
			});

			if (!response.ok) {
				// Special handling for CORS errors
				if (response.status === 0) {
					console.error('CORS error detected in image upload - Network error');
					throw new Error(
						'A network error occurred during image upload. This might be due to CORS restrictions.'
					);
				}
				throw new Error(`Failed to upload image: HTTP error ${response.status}`);
			}

			const result = await response.json();
			console.log('Image upload result:', result);

			return result.data.id;
		} catch (err) {
			console.error('Error uploading image:', err);
			throw err;
		}
	}

	// Submit the form
	async function handleSubmit() {
		if (loading) return;
		loading = true;
		error = null;

		try {
			// Validate inputs
			if (!formData.country) {
				error = 'Please select a country';
				loading = false;
				return;
			}

			if (!formData.familyContactNumber) {
				error = 'Please provide a family contact number';
				loading = false;
				return;
			}

			if (!formData.info.phone) {
				error = 'Please provide your phone number';
				loading = false;
				return;
			}

			// Upload image if selected
			if (selectedImage) {
				try {
					const uploadedImageId = await uploadImage();
					formData.info.picture = uploadedImageId;
				} catch (err) {
					error = 'Failed to upload image. Please try again.';
					loading = false;
					return;
				}
			}

			// Create profile
			const token = browser ? localStorage.getItem('token') : null;
			if (!token) {
				error = 'No authentication token found. Please log in again.';
				loading = false;
				return;
			}

			// Use the full URL to the API endpoint
			const API_BASE_URL = 'http://127.0.0.1:8000'; // Use your actual API URL
			const response = await fetch(`${API_BASE_URL}/profile/user`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify(formData),
				// Don't include credentials when there are CORS issues
				// credentials: 'include',
				mode: 'cors'
			});

			if (!response.ok) {
				if (response.status === 401) {
					error = 'Your session has expired. Please log in again.';
					auth.logout();
					goto('/login');
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
			console.log('Profile creation result:', result);

			if (result.success) {
				success = true;
				// Redirect to dashboard after short delay
				setTimeout(() => {
					goto('/dashboard');
				}, 2000);
			} else {
				error = result.message || 'Failed to create profile';
			}
		} catch (err) {
			console.error('Error creating profile:', err);
			error = 'Failed to create profile. Please try again.';
		} finally {
			loading = false;
		}
	}
</script>

<div class="mx-auto max-w-2xl">
	<div class="rounded-lg bg-white p-6 shadow-lg">
		<h1 class="mb-6 text-2xl font-bold text-gray-800">Create Your Profile</h1>

		{#if success}
			<div class="rounded-md bg-green-50 p-4">
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
							<p>Your profile has been created successfully! Redirecting to dashboard...</p>
						</div>
					</div>
				</div>
			</div>
		{:else}
			{#if error}
				<div class="mb-6 rounded-md bg-red-50 p-4">
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
			{/if}

			<form on:submit|preventDefault={handleSubmit} class="space-y-6">
				<!-- Profile Picture -->
				<div>
					<label class="block text-sm font-medium text-gray-700">Profile Picture</label>
					<div class="mt-1 flex items-center space-x-5">
						<div class="flex-shrink-0">
							{#if previewUrl}
								<img
									src={previewUrl}
									alt="Profile Preview"
									class="h-20 w-20 rounded-full object-cover"
								/>
							{:else}
								<div class="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200">
									<svg class="h-12 w-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
											clip-rule="evenodd"
										/>
									</svg>
								</div>
							{/if}
						</div>
						<input
							type="file"
							id="profile-picture"
							accept="image/*"
							on:change={handleImageSelect}
							class="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
						/>
					</div>
				</div>

				<!-- Employment Status -->
				<div>
					<label class="block text-sm font-medium text-gray-700">Are you employed abroad?</label>
					<div class="mt-1">
						<label class="inline-flex items-center">
							<input
								type="radio"
								name="employment-status"
								class="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
								bind:group={formData.isForeignEmployed}
								value={true}
							/>
							<span class="ml-2">Yes</span>
						</label>
						<label class="ml-6 inline-flex items-center">
							<input
								type="radio"
								name="employment-status"
								class="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
								bind:group={formData.isForeignEmployed}
								value={false}
							/>
							<span class="ml-2">No</span>
						</label>
					</div>
				</div>

				<!-- Country -->
				<div>
					<label for="country" class="block text-sm font-medium text-gray-700">Country</label>
					<div class="mt-1">
						<select
							id="country"
							bind:value={formData.country}
							class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
						>
							<option value="">Select a country</option>
							{#each countries as country}
								<option value={country}>{country}</option>
							{/each}
						</select>
					</div>
				</div>

				<!-- Phone Number -->
				<div>
					<label for="phone" class="block text-sm font-medium text-gray-700">Phone Number</label>
					<div class="mt-1">
						<input
							type="tel"
							id="phone"
							bind:value={formData.info.phone}
							class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							placeholder="+1234567890"
						/>
					</div>
				</div>

				<!-- Family Contact Number -->
				<div>
					<label for="family-contact" class="block text-sm font-medium text-gray-700"
						>Family Contact Number</label
					>
					<div class="mt-1">
						<input
							type="tel"
							id="family-contact"
							bind:value={formData.familyContactNumber}
							class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							placeholder="+1234567890"
						/>
					</div>
				</div>

				<!-- Submit Button -->
				<div>
					<button
						type="submit"
						class="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
						disabled={loading}
					>
						{#if loading}
							<svg
								class="mr-2 h-4 w-4 animate-spin"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							Creating Profile...
						{:else}
							Create Profile
						{/if}
					</button>
				</div>
			</form>
		{/if}
	</div>
</div>
