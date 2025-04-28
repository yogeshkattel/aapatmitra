<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let formData = {
		name: '',
		country: '',
		issue: '',
		location: '',
		emergencyLevel: '',
		contactType: '',
		violenceType: '',
		contactValue: '',
		image: 0
	};

	let loading = false;
	let error = null;
	let success = false;

	const emergencyLevels = ['low', 'medium', 'high', 'critical'];
	const contactTypes = ['email', 'whatsapp', 'phone', 'viber'];
	const violenceTypes = ['domestic'];

	async function handleSubmit() {
		if (loading) return;
		loading = true;
		error = null;

		try {
			const token = browser ? localStorage.getItem('token') : null;
			if (!token) throw new Error('No authentication token found');

			const API_BASE_URL = 'http://127.0.0.1:8000';
			const response = await fetch(`${API_BASE_URL}/reports`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
					Accept: 'application/json'
				},
				body: JSON.stringify(formData),
				mode: 'cors',
				cache: 'no-store'
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();
			if (result.success) {
				success = true;
				setTimeout(() => goto('/reports'), 2000);
			} else {
				error = result.message || 'Failed to create report';
			}
		} catch (err) {
			console.error('Error creating report:', err);
			error = 'Failed to create report. Please try again.';
		} finally {
			loading = false;
		}
	}
</script>

<div class="container mx-auto px-4 py-6">
	<div class="mb-6">
		<h1 class="text-2xl font-bold text-gray-800">Create New Report</h1>
		<p class="text-gray-600">Fill in the details below to create a new report</p>
	</div>

	{#if success}
		<div class="mb-6 rounded-md bg-green-50 p-4">
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
						<p>Your report has been created successfully! Redirecting to reports...</p>
					</div>
				</div>
			</div>
		</div>
	{/if}

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

	<div class="rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-md">
		<form on:submit|preventDefault={handleSubmit} class="space-y-4">
			<!-- Personal Information Section -->
			<div class="mb-4 border-b border-gray-200 pb-4">
				<h2 class="mb-4 text-lg font-medium text-gray-700">Personal Information</h2>

				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
						<label class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">Name</label>
						<div class="mt-1 sm:col-span-2 sm:mt-0">
							<input
								type="text"
								bind:value={formData.name}
								class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							/>
						</div>
					</div>

					<div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
						<label class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">Country</label>
						<div class="mt-1 sm:col-span-2 sm:mt-0">
							<input
								type="text"
								bind:value={formData.country}
								class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							/>
						</div>
					</div>

					<div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
						<label class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">Location</label>
						<div class="mt-1 sm:col-span-2 sm:mt-0">
							<input
								type="text"
								bind:value={formData.location}
								class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							/>
						</div>
					</div>

					<div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
						<label class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
							>Contact Type</label
						>
						<div class="mt-1 sm:col-span-2 sm:mt-0">
							<select
								bind:value={formData.contactType}
								class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							>
								<option value="" disabled selected>Select contact type</option>
								{#each contactTypes as type}
									<option value={type}>{type}</option>
								{/each}
							</select>
						</div>
					</div>

					<div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
						<label class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
							>Contact Value</label
						>
						<div class="mt-1 sm:col-span-2 sm:mt-0">
							<input
								type="text"
								bind:value={formData.contactValue}
								class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							/>
						</div>
					</div>
				</div>
			</div>

			<!-- Incident Details Section -->
			<div class="mb-4 border-b border-gray-200 pb-4">
				<h2 class="mb-4 text-lg font-medium text-gray-700">Incident Details</h2>

				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
						<label class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
							>Emergency Level</label
						>
						<div class="mt-1 sm:col-span-2 sm:mt-0">
							<select
								bind:value={formData.emergencyLevel}
								class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							>
								<option value="" disabled selected>Select emergency level</option>
								{#each emergencyLevels as level}
									<option value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
								{/each}
							</select>
						</div>
					</div>

					<div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
						<label class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
							>Violence Type</label
						>
						<div class="mt-1 sm:col-span-2 sm:mt-0">
							<select
								bind:value={formData.violenceType}
								class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							>
								<option value="" disabled selected>Select violence type</option>
								{#each violenceTypes as type}
									<option value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
								{/each}
							</select>
						</div>
					</div>

					<div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 md:col-span-2">
						<label class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
							>Issue Description</label
						>
						<div class="mt-1 sm:col-span-2 sm:mt-0">
							<textarea
								bind:value={formData.issue}
								rows="4"
								class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
								placeholder="Describe the issue in detail..."
							></textarea>
						</div>
					</div>
				</div>
			</div>

			<div class="mt-6 flex justify-end">
				<button
					type="button"
					class="mr-3 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
					on:click={() => goto('/dashboard/reports')}
				>
					Cancel
				</button>
				<button
					type="submit"
					class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
					disabled={loading}
				>
					{#if loading}
						<span class="flex items-center">
							<svg
								class="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
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
							Processing...
						</span>
					{:else}
						<span>Create Report</span>
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
